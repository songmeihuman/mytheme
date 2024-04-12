function videoPlay(sid, nid, quiet) {
  const playlist = document.querySelector(`ul#playlist[data-sid="${sid}"]`)
  if (playlist == null) return
  const target = playlist.querySelector(`[data-nid="${nid}"]`);
  if (target == null) return
  const url = target.getAttribute('data-url')
  const link = target.getAttribute('data-link')
  // 更改当前标记
  const oldItemActive = document.querySelector('ul#playlist a.btn-warm')
  if (oldItemActive) {
    oldItemActive.classList.replace('btn-warm', 'btn-gray')
    oldItemActive.parentNode.classList.remove('active')
  }
  const oldListActive = document.querySelector('.active > #playlist')
  if (oldListActive) {
    document.querySelector(`a[href="#${oldListActive.parentNode.id}"]`).parentNode.classList.remove('active')
    oldListActive.parentNode.classList.remove('active')
  }
  target.classList.add('active')
  target.querySelector('a').classList.replace('btn-gray', 'btn-warm')
  const listActive = target.parentNode.parentNode
  listActive.classList.add('active')
  document.querySelector(`a[href="#${listActive.id}"]`).parentNode.classList.add('active')
  // 更改当前播放信息
  player_aaaa.url = url
  player_aaaa.nid = nid
  player_aaaa.sid = sid
  player_aaaa.link = link
  player_aaaa.from = playlist.getAttribute('data-from')

  const nextTarget = playlist.querySelector(`li[data-nid="${nid + 1}"]`)
  if (nextTarget) {
    player_aaaa.link_next = nextTarget.getAttribute('data-url')
    player_aaaa.url_next = nextTarget.getAttribute('data-link')
  }
  // 更新url
  history.replaceState({}, null, link);
  if (!quiet) {
    // 开始播放
    const playerPage = document.getElementById('playvideo').contentWindow
    if (playerPage.switchVideo) {
      playerPage.switchVideo()
    } else {
      playerPage.location.reload()
    }
    setTimeout(function () {
      // 更新播放量
      MAC.Hits.Init();
      // 更新播放列表
      var history = document.querySelector(".vod_history");
      MyTheme.History.Set(
        history.getAttribute('data-name'), link,
        history.getAttribute('data-pic'), target.innerText.trim(),
        history.getAttribute('data-limit')
      );
      var $that = $(".mac_ulog_set");
      MAC.Ulog.Set(
        $that.attr('data-type'), $that.attr('data-mid'), $that.attr('data-id'),
        player_aaaa.sid, player_aaaa.nid, $that.attr('data-name'), target.innerText.trim(),
      );
    }, 1000)
  }
}
function videoPlayRelation(relation) {
  const sid = player_aaaa.sid
  let nid = player_aaaa.nid + relation
  const playlist = document.querySelector(`ul#playlist[data-sid="${sid}"]`)
  if (playlist == null) return
  while (true) {
    const target = playlist.querySelector(`[data-nid="${nid}"]`);
    if (target == null) return
    if ($(target).is(":visible")) break
    nid = nid + relation;
  }
  videoPlay(sid, nid);
}
function videoPlayNext() {
  videoPlayRelation(+1)
}
function videoPlayPrevious() {
  videoPlayRelation(-1)
}
function reportPlayerError() {
  const gbookUrl = "/index.php/gbook/index.html"
  const id = player_aaaa.id;
  const name = encodeURIComponent(player_aaaa.vod_data.vod_name)
  const msg = `【${name}】不能观看请检查修复，页面地址：${window.location.pathname}${window.location.search}，浏览器版本：${navigator.userAgent}`
  window.location.href = `${gbookUrl}?id=${id}&name=${encodeURIComponent(msg)}`
}
function filterVideo() {
  /* TODO 兼容，新版本删除 */
  const target = this
  if ($(this).hasClass('active')) return

  const parent = $(target).parent()
  const version = target.getAttribute('data-lang')
  const lis = $('ul > li', parent)
  $('.filter-button', parent).removeClass('active')
  $(target).addClass('active')
  lis.hide();
  $('> a', lis).filter((i, x) => {
    switch (version) {
      case "1":
        return x.innerText.includes('国语')
      case "2":
        return x.innerText.includes('粤语')
      case "3":
        return !x.innerText.includes('粤语') && !x.innerText.includes('国语')
      default:
        return true
    }
  }).parent().show();
}
ready(function () {
  document.querySelectorAll('.playlist').forEach(function (playlist) {
    playlist.addEventListener('click', function (e) {
      if (e.target.nodeName !== 'A') {
        return
      }
      const target = e.target.parentNode
      videoPlay(
        parseInt(target.parentNode.getAttribute('data-sid')),
        parseInt(target.getAttribute('data-nid'))
      )
    })
  })
  const params = new URLSearchParams(window.location.search)
  videoPlay(parseInt(params.get('sid')) || 1, parseInt(params.get('nid')) || 1, true)
  document.querySelector('#playvideo').src = "/index.php/player.html";

  $('.filter-button').on('click', filterVideo)
})