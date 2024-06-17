var MyTheme = {
  'Browser': {
    url: document.URL,
    domain: document.domain,
    title: document.title,
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    canvas: function () {
      return !!document.createElement("canvas").getContext
    }(),
    useragent: function () {
      var a = navigator.userAgent;
      return {
        mobile: !!a.match(/AppleWebKit.*Mobile.*/),
        ios: !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: -1 < a.indexOf("Android") || -1 < a.indexOf("Linux"),
        iPhone: -1 < a.indexOf("iPhone") || -1 < a.indexOf("Mac"),
        iPad: -1 < a.indexOf("iPad"),
        trident: -1 < a.indexOf("Trident"),
        presto: -1 < a.indexOf("Presto"),
        webKit: -1 < a.indexOf("AppleWebKit"),
        gecko: -1 < a.indexOf("Gecko") && -1 == a.indexOf("KHTML"),
        weixin: -1 < a.indexOf("MicroMessenger")
      }
    }()
  },
  'Cookie': {
    'Set': function (name, value, days) {
      var expires;
      if (days) {
        expires = days;
      } else {
        expires = "";
      }
      $.cookie(name, value, { expires: expires, path: '/' });
    },
    'Get': function (name) {
      var styles = $.cookie(name);
      return styles;
    },
    'Del': function (name, tips) {
      if (window.confirm(tips)) {
        $.cookie(name, null, { expires: -1, path: '/' });
        location.reload();
      } else {
        return false;
      }
    }
  },
  'Ajax': function (url, type, dataType, data, sfun, efun, cfun) {
    type = type || 'get';
    dataType = dataType || 'json';
    data = data || '';
    efun = efun || '';
    cfun = cfun || '';

    return $.ajax({
      url: url,
      type: type,
      dataType: dataType,
      data: data,
      timeout: 5000,
      beforeSend: function (XHR) {
      },
      error: function (XHR, textStatus, errorThrown) {
        if (efun) efun(XHR, textStatus, errorThrown);
      },
      success: function (data) {
        sfun(data);
      },
      complete: function (XHR, TS) {
        if (cfun) cfun(XHR, TS);
      }
    })
  },
  'Mobile': {
    'Nav': {
      'Init': function () {
        if ($(".nav-slide").length) {
          $(".nav-slide").each(function () {
            var $that = $(this);
            MyTheme.Mobile.Nav.Set($that, $that.attr('data-align'));
          });
        }
      },
      'Set': function (id, align) {
        $index = id.find('.active').index() * 1;
        if ($index > 3) {
          $index = $index - 3;
        } else {
          $index = 0;
        }
        id.flickity({
          cellAlign: align,
          freeScroll: true,
          contain: true,
          prevNextButtons: false,
          pageDots: false,
          percentPosition: true,
          initialIndex: $index
        });
      }
    },
    'Mshare': function () {
      $(".open-share").click(function () {
        MyTheme.Browser.useragent.weixin ? $("body").append('<div class="mobile-share share-weixin"></div>') : $("body").append('<div class="mobile-share share-other"></div>');
        $(".mobile-share").click(function () {
          $(".mobile-share").remove();
          $("body").removeClass("modal-open");
        });
      });
    }
  },
  'Images': {
    'Lazyload': function () {
      if (window.LazyLoad) {
        if (window.lazyLoadInstance) {
          lazyLoadInstance.update();
          return;
        }

        window.lazyLoadInstance = new LazyLoad({
          elements_selector: '.lazyload',
          data_bg: 'original',
          callback_error: (img) => {
            img.style.backgroundImage = 'url("/template/mytheme/statics/img/lazyload.png")';
          },
        });
      } else {
        $(".lazyload").lazyload({
          effect: "fadeIn",
          threshold: 200,
          load: function () {
            this.classList.remove('lazyload')
          },
          failure_limit: 1,
          skip_invisible: false,
        });
      }
    },
    'Qrcode': {
      'Init': function () {
        if ($("#qrcode").length) {
          var $that = $("#qrcode");
          MyTheme.Images.Qrcode.Set($that.attr('data-link'), $that.attr('data-dark'), $that.attr('data-light'));
          $that.attr("class", "img-responsive");
        }
      },
      'Set': function (url, dark, light) {
        url = 0 || location.href;
        var qrcode = new QRCode('qrcode', {
          text: url,
          width: 120,
          height: 120,
          colorDark: dark,
          colorLight: light,
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    },
    'Flickity': {
      'Init': function () {
        if ($(".flickity").length) {
          $(".flickity").each(function () {
            var $that = $(this);
            MyTheme.Images.Flickity.Set($that, $that.attr('data-align'), $that.attr('data-dots'), $that.attr('data-next'), $that.attr('data-play'));
          });
        }
      },
      'Set': function (id, align, dots, next, play) {
        dots = dots || false;
        next = next || false;
        play = play || false;
        id.flickity({
          cellAlign: align,
          wrapAround: true,
          contain: true,
          pageDots: dots,
          autoPlay: play,
          percentPosition: true,
          prevNextButtons: next
        });
      }
    }
  },
  'Link': {
    'Copy': {
      'Init': function () {
        $(".myui-copy-link").each(function () {
          var links = $(this).attr("data-url");
          MyTheme.Link.Copy.Set(this, links);
        });
        $(".myui-copy-html").each(function () {
          var html = $(this).parent().find(".content").html();
          MyTheme.Link.Copy.Set(this, html);
        });
      },
      'Set': function (id, content) {
        var clipboard = new Clipboard(id, {
          text: function () {
            return content;
          }
        });
        clipboard.on('success', function (e) {
          layer.msg('复制成功');
        });
        clipboard.on("error", function (e) {
          layer.msg('复制失败，请手动复制');
        });
      }

    },
    'Short': function () {
      $(".myui-short").each(function () {
        var codyId = this;
        var shortId = $(this);
        var shortUrl = shortId.val() || shortId.attr("data-url");
        var linkText = shortId.attr("data-text");
        if (myui.short == 1) {
          $.ajax({
            type: 'GET',
            url: myui.shortapi + encodeURIComponent(shortUrl),
            dataType: 'jsonp',
            success: function (r) {
              url_short = r.data.urls[0].url_short;
              if (shortId.val()) {
                shortId.val(linkText + url_short);
              } else if (shortId.attr("data-url")) {
                shortId.attr("data-url", url_short);
                MyTheme.Link.Copy.Set(codyId, linkText + url_short);
              }
            }
          });
        } else {
          if (shortId.val()) {
            shortId.val(linkText + shortUrl);
          } else if (shortId.attr("data-url")) {
            shortId.attr("data-url", shortUrl);
            MyTheme.Link.Copy.Set(codyId, linkText + shortUrl);
          }
        }
      });
    }
  },
  'Layer': {
    'Img': function (title, src, text) {
      layer.open({
        type: 1,
        title: title,
        skin: 'layui-layer-rim',
        content: '<div class="col-pd"><p><img src="' + src + '" width="240" /></p><p class="text-center">' + text + '</p></div>'
      });
    },
    'Html': function (title, html) {
      layer.open({
        type: 1,
        title: title,
        skin: 'layui-layer-rim',
        content: '<div class="col-pd">' + html + '</div>'
      });
    },
    'Div': function (id) {
      layer.open({
        type: 1,
        title: false,
        skin: 'layui-layer-rim',
        content: $(id)
      });
    },
    'Popbody': function (name, title, html, day, wide, high) {
      var pop_is = MyTheme.Cookie.Get(name);
      var html = $(html).html();
      if (!pop_is) {
        layer.open({
          type: 1,
          title: title,
          skin: 'layui-layer-rim',
          content: html,
          area: [wide + 'px', high + 'px'],
          cancel: function () {
            MyTheme.Cookie.Set(name, 1, day);
          }
        });
      }
    }
  },
  'SideBar': class SideBar {
    constructor(selector, toggler, pancels) {
      this.selector = $(selector);
      this.toggler = toggler;
      this.pancels = pancels;
    }
    render() {
      const root = this.selector;
      root.simplerSidebarCss3({
        toggler: this.toggler,
        quitter: ".quit-sidebar",
        align: "right",
        events: {
          onOpen: x => {
            root.find('.nav a:first').tab('show');
          }
        }
      });
      this.watchEvents();
      root.show();
    }
    watchEvents() {
      this.selector.find('.nav a').on('show.bs.tab', e => {
        if (e.target.getAttribute('data-init') === "1") {
          return;
        }
        e.target.setAttribute('data-init', "1");
        const targetID = e.target.getAttribute('href').slice(1);
        for (const pancel of this.pancels) {
          if (pancel.selector.attr('id') == targetID) {
            pancel.render();
            break;
          }
        }
      })
    }
  },
  'SideBarPancel': class SideBarPancel {
    constructor(name, selector, dataProvider, requireLogin) {
      this.name = name;
      this.selector = $(selector);
      this.dataProvider = dataProvider;
      this.requireLogin = !!requireLogin;
    }
    init() {
      this.dataProvider.Init();
    }
    renderFlow(datas) {
      let result = "";
      const vods = datas.sort((a, b) => b.time - a.time);
      const dupUlogs = {};
      let lastTimeGroup = "";
      for (let i = 0; i < vods.length; i++) {
        const vod = vods[i];
        if (!vod.id || vod.id in dupUlogs) { continue }
        dupUlogs[vod.id] = 1;
        const timeGroup = vod.time ? new Date(vod.time * 1000).toLocaleDateString() : '以往';
        if (lastTimeGroup !== timeGroup) {
          lastTimeGroup = timeGroup;
          result += `<p class='text-muted'>${timeGroup}</p>`;
        }
        const pic = vod.pic || '/template/mytheme/statics/img/lazyload.png';
        const link = MAC.Vod.GetUrl(vod.id, vod.sid, vod.nid);
        result += `<div class="flow-list-item">
          <div class="flow-list-item-pic">
            <a class="myui-vodlist__thumb lazyload" href='${link}' data-original="${pic}">
            </a>
          </div>
          <div class="flow-list-item-note">
            <a class='text-333' href='${link}'>
              ${vod.name}
              <div class='text-red'>${vod.part}</div>
            </a>
          </div>
          <div class="text-red flow-list-item-btn">
            <i class="fa fa-cancel" data-id="${vod.id}"></i>
          </div>
        </div>`;
      }
      return result;
    }
    // 监控js事件
    watchEvents() {
      const that = this;
      this.selector.find('.sidebar-head').on('click', () => this.clear());
      this.selector.on('click', 'i.fa-cancel', async function () {
        if (!confirm("您确定要删除吗？")) {
          return;
        }
        const id = $(this).data('id');
        await that.remove(id)
        $(this).parents('.flow-list-item:first').remove();
      });
    }
    // 根据数据渲染侧边栏
    renderData(data) {
      let html = `<p class='text-muted sidebar-head'><a class='pull-right text-red' href='javascript:;'>[清空]</a>${this.name}</p>`;
      if (data) {
        html += this.renderFlow(data);
      } else {
        html += "<p style='padding: 80px 0; text-align: center'>这里什么都没有</p>";
      }
      this.selector.html(html);
      this.watchEvents();
      MyTheme.Images.Lazyload();
    }
    // 渲染侧边栏
    async render() {
      if (self.requireLogin && !MAC.User.IsLogin) {
        this.selector.html("<p style='padding: 80px 0; text-align: center'>请先登录</p>");
        return;
      }
      this.renderLoading(async (cancel) => {
        const data = await this.dataProvider.Get();
        cancel();
        this.renderData(data);
      });
    }
    // 显示提示：正在加载中
    async renderLoading(callback) {
      let waiting = 2;
      const intervalId = setInterval(() => {
        if (waiting !== 0) {
          const result = `<p style='padding: 80px 0; text-align: center'>正在加载数据${''.padEnd(waiting % 4, '.')}</p>`;
          this.selector.html(result);
          waiting++;
        }
      }, 1000);
      const cancel = () => {
        clearInterval(intervalId);
        waiting = 0;
      }
      await callback(cancel);
    }
    remove(id) {
      return this.dataProvider.Remove(id);
    }
    async clear() {
      if (!confirm(`您确定要清空${this.name}吗？`)) {
        return;
      }
      await this.dataProvider.Clear();
      window.location.reload();
    }
  },
  'LocalData': class LocalData {
    constructor(name) {
      this.name = name;
    }
    Init() { }
    ToFlowListItem(data) {
      if (!data.time) {
        // 兼容旧格式
        const pattern = /\/index\.php\/vod\/play\/id\/([^/.]+)\.html\?sid=([^&]+)&nid=([^&]+)/;
        const match = data.link.match(pattern);
        if (match) {
          data.id = match[1];
          data.sid = match[2];
          data.nid = match[3];
          data.time = 0;
        }
        // } else {
        //   data.link = MAC.Vod.GetUrl(data.id, data.sid, data.nid);
      }
      return data;
    }
    Clear() {
      localStorage.removeItem(this.name);
      return Promise.resolve(true);
    }
    async Remove(id) {
      let data = await this.Get();
      let index = data.findIndex(x => x.id == id);
      if (index > -1) {
        data.splice(index, 1);
        localStorage.setItem(this.name, JSON.stringify(data));
        return true;
      } else {
        return false;
      }
    }
    async Get() {
      var value = localStorage.getItem(this.name)
      if (value) {
        let values = JSON.parse(value) || [];
        return values.map(this.ToFlowListItem);
      } else {
        return [];
      }
    }
    async Set(name, mid, id, sid, nid, part, pic, limit) {
      let data = await this.Get();
      const newItem = { name, id, sid, nid, part, pic, time: parseInt(Date.now() / 1000) };
      // 将当前数据移到最前面
      let index = -1;
      data = data.map((item, i) => {
        if (item.name === name) {
          index = i;
          return newItem;
        } else {
          return item;
        }
      })
      if (index === -1) {
        data.unshift(newItem);
      } else if (index !== 0) {
        const tmp = data.splice(index, 1);
        data.unshift(tmp[0]);
      }
      if (limit) {
        // 只保存limit个数据，多出来的要删除，同时要删除播放位置
        const remove_data = data.slice(limit);
        if (remove_data.length) {
          data = data.slice(0, limit);
        }
      }
      localStorage.setItem(this.name, JSON.stringify(data));
    }
  },
  'RemoteData': class RemoteData {
    constructor(dataType) {
      this.dataType = dataType;
    }
    Init() { }
    Get() {
      return MAC.Ulog.Get(1, '', this.dataType, 1, 1000).then(resp => {
        return resp.list.map(data => {
          data.link = MAC.Vod.GetUrl(data.id, data.sid, data.nid);
          return data;
        })
      })
    }
    Clear() {
      return MAC.Ulog.Clean(this.dataType, '', '');
    }
    Remove(id) {
      return MAC.Ulog.Remove(this.dataType, '', id);
    }
    Set(name, mid, id, sid, nid, part, pic) {
      return MAC.Ulog.Set(this.dataType, mid, id, sid, nid, name, part, pic);
    }
  },
  'History': {
    'Init': function () {
      const localHistory = new MyTheme.LocalData('history');
      const remoteHistory = new MyTheme.RemoteData(4);
      const localHistoryPancel = new MyTheme.SideBarPancel('本地播放记录', '#local_history', localHistory);
      const remoteHistoryPancel = new MyTheme.SideBarPancel('远端播放记录', '#remote_history', remoteHistory, true);
      const sidebar = new MyTheme.SideBar("#history-sidebar", "#history-btn", [
        localHistoryPancel,
        remoteHistoryPancel,
      ]);
      sidebar.render();
      // 将当前页面加入播放历史
      const $that = $(".vod_history");
      if ($that.length) {
        const args = [
          $that.attr('data-name'), $that.attr('data-mid'),
          $that.attr('data-id'), $that.attr('data-sid'),
          $that.attr('data-nid'), $that.attr('data-part'),
          $that.attr('data-pic'), $that.attr('data-limit')];
        localHistory.Set.apply(localHistory, args);
        remoteHistory.Set.apply(remoteHistory, args);
      }
    }
  },
  'Fav': {
    'Init': function () {
      const localFav = new MyTheme.LocalData('favorite');
      const remoteFav = new MyTheme.RemoteData(2);
      const localFavPancel = new MyTheme.SideBarPancel('本地收藏记录', '#local_favorite', localFav);
      const remoteFavPancel = new MyTheme.SideBarPancel('远端收藏记录', '#remote_favorite', remoteFav, true);
      const sidebar = new MyTheme.SideBar("#favorite-sidebar", "#favorite-btn", [
        localFavPancel,
        remoteFavPancel,
      ]);
      sidebar.render();
    },
    'Set': function () {
      const $that = $(".mac_ulog_set");
      if ($that.length) {
        const localFav = new MyTheme.LocalData('favorite');
        const remoteFav = new MyTheme.RemoteData(2);
        const args = [
          $that.attr('data-name'), $that.attr('data-mid'),
          $that.attr('data-id'), $that.attr('data-sid'),
          $that.attr('data-nid'), $that.attr('data-part'),
          $that.attr('data-pic'), $that.attr('data-limit')];
        localFav.Set.apply(localFav, args);
        remoteFav.Set.apply(remoteFav, args);
        alert("收藏成功");
      }
    }
  },
  'Search': {
    'CleanLocal': function () {
      if (confirm("您确定要清空本地搜索历史吗？")) {
        localStorage.removeItem('dy_wd_history');
        window.location = '/';
      }
    },
    'Init': function () {
      $(".open-search").click(function () {
        var seacrhBox = $(".search-box");
        seacrhBox.addClass("active").siblings().hide();
        seacrhBox.find(".form-control").focus();
        seacrhBox.find(".head-dropdown").toggle();
        $(".search-close").click(function () {
          seacrhBox.removeClass("active").siblings().show();
          seacrhBox.find(".dropdown-box").hide();
        });
      });
      // 将搜索关键词静态化
      $('#search').on('submit', function () {
        const $elm = $(this);
        const wd = $elm.find('input').val();
        const action = $elm.attr('action');
        $elm.attr('action', action.replace('.html', `/wd/${wd}.html`));
      })
      // 搜索历史
      const rawWds = localStorage.getItem("dy_wd_history");
      const wds = rawWds ? JSON.parse(rawWds) : [];
      const elm = $('.search-dropdown-hot > .item');
      const searchUrl = '/index.php/new_search/search';
      for (let i = 0; i < wds.length; i++) {
        const wd = wds[i];
        const html = `<p><a class="text-333" href="${searchUrl + `/wd/${wd}.html`}"><span class="badge ${i === 0 ? 'badge-first' : i === 1 ? 'badge-second' : i === 2 ? 'badge-third' : ''}">${i + 1}</span>${wd}</a></p>`
        elm.append(html);
      }
    }
  },
  'Collect': {
    'Init': function () {
    },
    'Save': function () {
    },
    'Remove': function () {

    },
    'Load': function () {
    },
  },
  'Other': {
    'Headroom': function () {
      if ($("#header-top").length && window.Headroom) {
        var header = document.querySelector("#header-top");
        var headroom = new Headroom(header, {
          tolerance: 5,
          offset: 205,
          classes: {
            initial: "top-fixed",
            pinned: "top-fixed-up",
            unpinned: "top-fixed-down"
          }
        });
        headroom.init();
      }

    },
    'Popup': function (id) {
      $(id).addClass("popup-visible");
      $("body").append('<div class="mask"></div>').addClass("hidden");
      $(".close-popup").click(function () {
        $(id).removeClass("popup-visible");
        $(".mask").remove();
        $("body").removeClass("hidden");
      });
      $(".mask").click(function () {
        $(id).removeClass("popup-visible");
        $(this).remove();
        $("body").removeClass("hidden");
      });
    },
    'Bootstrap': function () {
      $('a[data-toggle="tab"]').on("shown.bs.tab", function (a) {
        var b = $(a.target).text();
        $(a.relatedTarget).text();
        $("span.active-tab").html(b);
      });
    },
    'Skin': function () {
      var skinnum = 0;
      var lengths = $("link[name='skin']").length;
      $('.btnskin').click(function () {
        skinnum += 1;
        if (skinnum == lengths) { skinnum = 0; }
        var skin = $("link[name='skin']").eq(skinnum).attr("data-href");
        //layer.msg("正在切换皮肤，请稍后...",{anim:5,time: 2000},function(){
        //	$("link[name='default']").attr({href:skin});
        //});
        $("link[name='default']").attr({ href: skin });
        // MyTheme.Cookie.Set('skinColor',skin,365);
        localStorage.setItem('skinColor', skin);
      });
      //var color = MyTheme.Cookie.Get('skinColor');
      var color = localStorage.getItem("skinColor");
      if (color) {
        $("link[name='default']").attr({ href: color });
      }
    },
    'Sort': function () {
      $(".sort-button").each(function () {
        $(this).on("click", function (e) {
          e.preventDefault();
          $(this).parent().parent().parent().find(".sort-list").each(function () {
            var playlist = $(this).find("li");
            for (let i = 0, j = playlist.length - 1; i < j;) {
              var l = playlist.eq(i).clone(true);
              var r = playlist.eq(j).replaceWith(l);
              playlist.eq(i).replaceWith(r);
              ++i;
              --j;
            }
          });
        });
      });
      $(".sort-player-list").each(function () {
        $(this).on("click", function (e) {
          e.preventDefault();
          if ($(this).hasClass("active")) { return; }
          $(this).siblings().removeClass("active");
          $(this).addClass("active")
          $(this).parent().parent().parent().find(".sort-list").each(function () {
            var playlist = $(this).find("li");
            for (let i = 0, j = playlist.length - 1; i < j;) {
              var l = playlist.eq(i).clone(true);
              var r = playlist.eq(j).replaceWith(l);
              playlist.eq(i).replaceWith(r);
              ++i;
              --j;
            }
          });
        });
      });
      $('.filter-player-list').on('click', function () {
        const target = this
        if ($(this).hasClass('active')) { return; }

        const parent = $(target).parent().parent().parent();
        const version = target.getAttribute('data-lang');
        const lis = $('ul > li', parent);
        $(target).siblings().removeClass("active");
        $(target).addClass('active');
        lis.hide();
        $('> a', lis).filter((i, x) => {
          switch (version) {
            case "1":
              return x.innerText.includes('国语');
            case "2":
              return x.innerText.includes('粤语');
            case "3":
              return !x.innerText.includes('粤语') && !x.innerText.includes('国语');
            default:
              return true;
          }
        }).parent().show();
      });
    },
    'Collapse': function () {
      $(".text-collapse").each(function () {
        $(this).find(".details").on("click", function () {
          $(this).parent().find(".sketch").addClass("hide");
          $(this).parent().find(".data").css("display", "");
          $(this).remove();
        });
      });
      $(".dropdown-hover").click(function () {
        $(this).find(".dropdown-box").toggle();
      });
    },
    'Scrolltop': function () {
      var a = $(window);
      $scrollTopLink = $("a.backtop");
      a.scroll(function () {
        500 < $(this).scrollTop() ? $scrollTopLink.css("display", "") : $scrollTopLink.css("display", "none");
      });
      $scrollTopLink.on("click", function () {
        $("html, body").animate({
          scrollTop: 0
        }, 400);
        return true;
      });
    },
    'Slidedown': function () {
      var display = $('.slideDown-box');
      $(".slideDown-btn").click(function () {
        if (display.css('display') == 'block') {
          display.slideUp("slow");
          $(this).html('展开  <i class="fa fa-angle-down"></i>');
          MyTheme.Mobile.Nav.Init();
        } else {
          display.slideDown("slow");
          $(this).html('收起   <i class="fa fa-angle-up"></i>');
          MyTheme.Mobile.Nav.Init();
        }
      });
    },
    'Player': function () {
      if ($("#player-left").length) {
        var PlayerLeft = $("#player-left");
        var PlayerSide = $("#player-sidebar");
        var LeftHeight = PlayerLeft.outerHeight();
        var Position = $("#playlist li.active").position().top;
        $("#player-sidebar-is").click(function () {
          PlayerSide.toggle();
          if (PlayerSide.css("display") === 'none') {
            PlayerLeft.css("width", "100%");
            $(this).html("<i class='fa fa-angle-left'></i>");
          }
          if (PlayerSide.css("display") === 'block') {
            PlayerLeft.css("width", "");
            $(this).html("<i class='fa fa-angle-right'></i>");
          }
        });
        if (!MyTheme.Browser.useragent.mobile) {
          PlayerSide.css({ "height": LeftHeight, "overflow": "auto" });
          PlayerSide.scrollTop(Position);
        }
      }
      if ($(".player-fixed").length) {
        if (!MyTheme.Browser.useragent.mobile) {
          $(window).scroll(function () {
            if ($(window).scrollTop() > window.outerHeight) {
              $(".player-fixed").addClass("fixed fadeInDown");
              $(".player-fixed-off").show();
            } else if ($(window).scrollTop() < window.outerHeight) {
              $(".player-fixed").removeClass("fixed fadeInDown");
              $(".player-fixed-off").hide();
            }
          });
        }
        $(".player-fixed-off").click(function () {
          $(".player-fixed").removeClass("fixed fadeInDown");
        });
      }
    },
    'Close': function () {
      $(".close-btn").on("click", function () {
        $(this).parents(".close-box").remove();
      });
    },
    'Roll': function (obj, higt) {
      setInterval(function () {
        $(obj).find("ul").animate({
          marginTop: higt,
        }, 1000, function () {
          $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
        })
      }, 3000);
    },
    'Share': function () {
      // we don't need any more
      /*
      if(".bdshare".length){
        window._bd_share_config = {
          common: {
            bdText: '',
            bdDesc: '',
            bdUrl: '',
            bdPic: ''
          },
          share: [{
            "bdSize": 24,
            bdCustomStyle: myui.tpl+'statics/css/mytheme-share.css'
          }]
        }
        with(document)0[(getElementsByTagName("head")[0]||body).appendChild(createElement('script')).src=''+myui.bdapi+'?cdnversion='+~(-new Date()/36e5)];
      }			
        */
    },
  }
};

$(function () {
  if (MyTheme.Browser.useragent.mobile) {
    MyTheme.Mobile.Nav.Init();
    MyTheme.Mobile.Mshare();
  }
  MyTheme.History.Init();
  MyTheme.Fav.Init();
  MyTheme.Search.Init();
  MyTheme.Images.Flickity.Init();
  MyTheme.Images.Lazyload();
  MyTheme.Link.Copy.Init();
  MyTheme.Link.Short();
  MyTheme.Other.Bootstrap();
  MyTheme.Other.Sort();
  MyTheme.Other.Collapse();
  MyTheme.Other.Slidedown();
  MyTheme.Other.Scrolltop();
  // MyTheme.Other.Player();
  MyTheme.Other.Close();
});

window.addEventListener('message', function (e) {
  if (e.data == "ldgnext") {
    if (MacPlayer.PlayLinkNext != '') {
      location.href = MacPlayer.PlayLinkNext;
    }
  }
}, false);
