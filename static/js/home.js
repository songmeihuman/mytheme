String.prototype.replaceAll = function (s1, s2) { return this.replace(new RegExp(s1, "gm"), s2); }
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); }

var MAC = {
  'Url': document.URL,
  'Title': document.title,
  'UserAgent': function () {
    var ua = navigator.userAgent;//navigator.appVersion
    return {
      'mobile': !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1, //android终端或者uc浏览器
      'iPhone': ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
      'iPad': ua.indexOf('iPad') > -1, //是否iPad
      'trident': ua.indexOf('Trident') > -1, //IE内核
      'presto': ua.indexOf('Presto') > -1, //opera内核
      'webKit': ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      'gecko': ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
      'weixin': ua.indexOf('MicroMessenger') > -1 //是否微信 ua.match(/MicroMessenger/i) == "micromessenger",
    };
  }(),
  'Open': function (u, w, h) {
    window.open(u, 'macopen1', 'toolbars=0, scrollbars=0, location=0, statusbars=0,menubars=0,resizable=yes,width=' + w + ',height=' + h + '');
  },
  'Cookie': {
    'Set': function (name, value, days) {
      var exp = new Date();
      exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
      var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
      document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;expires=" + exp.toUTCString();
    },
    'Get': function (name) {
      var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
      if (arr != null) { return decodeURIComponent(arr[2]); return null; }
    },
    'Del': function (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.Get(name);
      if (cval != null) { document.cookie = name + "=" + encodeURIComponent(cval) + ";path=/;expires=" + exp.toUTCString(); }
    }
  },
  'GoBack': function () {
    var ldghost = document.domain;
    if (document.referrer.indexOf(ldghost) > 0) {
      history.back();
    }
    else {
      window.location = "//" + ldghost;
    }
  },
  'Ajax': function (url, type, dataType, data, sfun, efun, cfun) {
    if (typeof type === 'function') {
      sfun = type;
      type = null;
    }
    type = type || 'get';
    dataType = dataType || 'json';
    data = data || '';
    sfun = sfun || '';
    efun = efun || '';
    cfun = cfun || '';

    $.ajax({
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
        if (sfun) sfun(data);
      },
      complete: function (XHR, TS) {
        if (cfun) cfun(XHR, TS);
      }
    })
  },
  'Qrcode': {
    'Init': function () {
      $('.mac_qrcode').attr('src', maccms.path + '/index.php/qrcode/index.html?url=' + MAC.Url);
    }
  },
  'Image': {
    'Lazyload': {
      'Show': function () {
        try { $("img.lazy").lazyload(); } catch (e) { };
      },
      'Box': function ($id) {
        $("img.lazy").lazyload({
          container: $("#" + $id)
        });
      }
    }
  },
  'Hits': {
    'Init': function () {
      if ($('.mac_hits').length != 0) {
        var $that = $(".mac_hits");
        MAC.Ajax(maccms.path + '/index.php/ajax/hits?mid=' + $that.attr("data-mid") + '&id=' + $that.attr("data-id") + '&type=update');
      }
    }
  },
  'Digg': {
    'Init': function () {
      $('body').on('click', '.digg_link', function (e) {
        var $that = $(this);
        if ($that.attr("data-id")) {
          MAC.Ajax(maccms.path + '/index.php/ajax/digg.html?mid=' + $that.attr("data-mid") + '&id=' + $that.attr("data-id") + '&type=' + $that.attr("data-type"), 'get', 'json', '', function (r) {
            $that.addClass('disabled');
            if (r.code == 1) {
              if ($that.attr("data-type") == 'up') {
                $that.find('.digg_num').html(r.data.up);
              }
              else {
                $that.find('.digg_num').html(r.data.down);
              }
            }
            else {
              $that.attr('title', r.msg);
            }
          });

        }
      });
    }
  },
  'AdsWrap': function (w, h, n) {
    document.writeln('<img width="' + w + '" height="' + h + '" alt="' + n + '" style="background-color: #CCCCCC" />');
  },
  'Css': function ($url) {
    $("<link>").attr({ rel: "stylesheet", type: "text/css", href: $url }).appendTo("head");
  },
  'Js': function ($url) {
    $.getScript($url, function (response, status) {

    });
  },
  'Desktop': function (s) {
    location.href = maccms.path + '/index.php/ajax/desktop?name=' + encodeURI(s) + '&url=' + encodeURI(location.href);
  },
  'Error': function (tab, id, name) {

  },
  'AddEm': function (obj, i) {
    var oldtext = $(obj).val();
    $(obj).val(oldtext + '[em:' + i + ']');
  },
  'Remaining': function (obj, len, show) {
    var count = len - $(obj).val().length;
    if (count < 0) {
      count = 0;
      $(obj).val($(obj).val().substr(0, 200));
    }
    $(show).text(count);
  },
  'Comment': {
    'Login': 0,
    'Verify': 0,
    'Init': function () {

      $('body').on('click', '.comment_face_box img', function (e) {
        var obj = $(this).parent().parent().parent().find('.comment_content');
        MAC.AddEm(obj, $(this).attr('data-id'));
      });
      $('body').on('click', '.comment_face_panel', function (e) {
        // $('.comment_face_box').toggle();
        $(this).parent().find('.comment_face_box').toggle();
      });
      $('body').on('keyup', '.comment_content', function (e) {
        var obj = $(this).parent().parent().parent().parent().find('.comment_remaining');
        MAC.Remaining($(this), 200, obj)
      });
      $('body').on('focus', '.comment_content', function (e) {
        if (MAC.Comment.Login == 1 && MAC.User.IsLogin != 1) {
          MAC.User.Login();
        }
      });

      $('body').on('click', '.comment_report', function (e) {
        var $that = $(this);
        if ($(this).attr("data-id")) {
          MAC.Ajax(maccms.path + '/index.php/comment/report.html?id=' + $that.attr("data-id"), 'get', 'json', '', function (r) {
            $that.addClass('disabled');
            MAC.Pop.Msg(100, 20, r.msg, 1000);
            if (r.code == 1) {
            }
          });
        }
      });

      $('body').on('click', '.comment_reply', function (e) {
        var $that = $(this);
        if ($that.attr("data-id")) {
          var str = $that.html();
          $('.comment_reply_form').remove();
          if (str == '取消回复') {
            $that.html('回复');
            return false;
          }
          if (str == '回复') {
            $('.comment_reply').html('回复');
          }
          var html = $('.comment_form').prop("outerHTML");

          var oo = $(html);
          oo.addClass('comment_reply_form');
          oo.find('input[name="comment_pid"]').val($that.attr("data-id"));

          $that.parent().after(oo);
          $that.html('取消回复');
        }
      });

      $('body').on('click', '.comment_submit', function (e) {
        var $that = $(this);
        MAC.Comment.Submit($that);
      });

    },
    'Show': function ($page) {
      if ($(".mac_comment").length > 0) {
        MAC.Ajax(maccms.path + '/index.php/comment/ajax.html?rid=' + $('.mac_comment').attr('data-id') + '&mid=' + $('.mac_comment').attr('data-mid') + '&page=' + $page, 'get', 'json', '', function (r) {
          $(".mac_comment").html(r);
        }, function () {
          $(".mac_comment").html('<a href="javascript:void(0)" onclick="MAC.Comment.Show(' + $page + ')">评论加载失败，点击我刷新...</a>');
        });
      }
    },
    'Reply': function ($o) {

    },
    'Submit': function ($o) {
      var form = $o.parents('form');
      if ($(form).find(".comment_content").val() == '') {
        MAC.Pop.Msg(100, 20, '请输入您的评论！', 1000);
        return false;
      }
      if ($('.mac_comment').attr('data-mid') == '') {
        MAC.Pop.Msg(100, 20, '模块mid错误！', 1000);
        return false;
      }
      if ($('.mac_comment').attr('data-id') == '') {
        MAC.Pop.Msg(100, 20, '关联id错误！', 1000);
        return false;
      }
      MAC.Ajax(maccms.path + '/index.php/comment/saveData', 'post', 'json', $(form).serialize() + '&comment_mid=' + $('.mac_comment').attr('data-mid') + '&comment_rid=' + $('.mac_comment').attr('data-id'), function (r) {
        MAC.Pop.Msg(100, 20, r.msg, 1000);
        if (r.code == 1) {
          MAC.Comment.Show(1);
        }
        else {
          if (MAC.Comment.Verify == 1) {
            MAC.Verify.Refresh();
          }
        }
      });
    }
  },
  'Gbook': {
    'Login': 0,
    'Verify': 0,
  },
  'Ulog': {
    'GetUrl': function(ac, mid, id, type) {
      return `${maccms.path}/index.php/user/ajax_ulog?ac=${ac}&mid=${mid}&id=${id}&type=${type}`;
    },
    'Init': function () {
    },
    'Get': function (mid, id, type, page, limit, call) {
      if (!MAC.User.IsLogin) return Promise.reject('no login');
      const p = fetch(`${MAC.Ulog.GetUrl('list', mid, id, type)}&page=${page}&limit=${limit}`).then(x => x.json());
      if (call) {
        p = p.then(call);
      }
      return p;
    },
    'Set': function (type, mid, id, sid, nid, name, part, pic) {
      if (!MAC.User.IsLogin) return Promise.reject('no login');
      return fetch(`${MAC.Ulog.GetUrl('set', mid, id, type)}&sid=${sid}&nid=${nid}&name=${name}&part=${part}&pic=${pic}`).then(x => x.json())
    },
    'Clean': function (type, mid, id) {
      if (!MAC.User.IsLogin) return Promise.reject('no login');
      return fetch(`${MAC.Ulog.GetUrl('clean', mid, id, type)}`).then(x => x.json())
    },
    'Remove': function (type, mid, id) {
      if (!MAC.User.IsLogin) return Promise.reject('no login');
      return fetch(`${MAC.Ulog.GetUrl('remove', mid, id, type)}`).then(x => x.json())
    },
  },
  'Vod': {
    'GetUrl': function(id, sid, nid) {
      return `${maccms.path}/index.php/vod/play/id/${id}.html?sid=${sid}&nid=${nid}`;
    }
  },
  'User': {
    'IsLogin': 0,
    'UserId': '',
    'UserName': '',
    'UserNickName': '',
    'Init': function () {
      if (MAC.Cookie.Get('user_id') !== undefined && MAC.Cookie.Get('user_id') !== '0') {
        MAC.User.UserId = MAC.Cookie.Get('user_id');
        MAC.User.UserName = MAC.Cookie.Get('user_name');
        MAC.User.UserNickName = MAC.Cookie.Get('user_nick_name');
        MAC.User.IsLogin = 1;
      }

      if (MAC.User.IsLogin === 1) {
        const userArea = $('#user_area');
        userArea.find('> a > i').attr('class', 'fa fa-user-circle-o');
        userArea.find('.username').text(MAC.User.UserNickName || MAC.User.UserName);
        userArea.find('.btn_login').hide();
        userArea.find('.btn_logout').show();
      }
    }
  }
}

$(function () {
  //异步加载图片初始化
  MAC.Image.Lazyload.Show();
  //用户
  MAC.User.Init();
  setTimeout(function () {
    //初始化用户日志相关操作，包含1浏览2收藏3想看4点播5下载
    MAC.Ulog.Init();
    //点击数量
    MAC.Hits.Init();
    //二维码初始化
    // MAC.Qrcode.Init();
    //顶和踩初始化
    // MAC.Digg.Init();
  }, 1000);
});
