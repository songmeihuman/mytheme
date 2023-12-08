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
        var lazyLoadInstance = new LazyLoad({
          elements_selector: '.lazyload',
          data_bg: 'original',
        });
      } else {
        $(".lazyload").lazyload({
          effect: "fadeIn",
          threshold: 200,
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
            //MyTheme.Images.Lazyload();
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
  'History': {
    'Init': function () {
      // 页面加载的时候，将当前页面加入历史记录
      if ($(".vod_history").length) {
        var $that = $(".vod_history");
        MyTheme.History.Set($that.attr('data-name'), $that.attr('data-link'), $that.attr('data-pic'), $that.attr('data-part'), $that.attr('data-limit'));
      }
      // 当页面加载，初始化导航栏的历史记录
      const root = $("#sidebar");
      root.simplerSidebarCss3({
        toggler: "#historyBtn",
        quitter: ".quit-sidebar",
        align: "right",
        events: {
          onOpen: x => {
            root.find('.nav a:first').tab('show');
          }
        }
      });
      root.find('.nav a').on('show.bs.tab', e => {
        if (e.target.getAttribute('data-init') === "1") {
          return;
        }
        e.target.setAttribute('data-init', "1");

        if (e.target.getAttribute('href') === "#local_history") {
          MyTheme.History.LoadLocal();
        }else{
          MyTheme.History.LoadRemote();
        }
      })
      root.show();
    },
    'CleanLocal': function() {
      if (confirm("您确定要清空本地播放记录吗？")) {
        localStorage.clear()
        window.location.reload()
      }
    },
    'LoadLocal': function () {
      var history_get = localStorage.getItem("history");
      var result = "<p class='text-muted'><a class='pull-right text-red' href='javascript:;' onclick='MyTheme.History.CleanLocal()'>[清空]</a>本地播放记录</p>";
      if (history_get) {
        var json = JSON.parse(history_get);
        for (i = 0; i < json.length; i++) {
          result += "<p><a class='text-333' href='" + json[i].link + "' title='" + json[i].name + "'><span class='pull-right text-red'>" + json[i].part + "</span>" + json[i].name + "</a></p>";
        }
      } else {
        result += "<p style='padding: 80px 0; text-align: center'>您还没有看过影片哦</p>";
      }
      $("#local_history").html(result);
    },
    'LoadRemote': function () {
      const root = $("#remote_history");
      if (!MAC.User.IsLogin) {
          const result = `<p style='padding: 80px 0; text-align: center'>请先登录</p>`;
          root.html(result);
          return;
      }
      let waiting = 2;
      const intervalId = setInterval(() => {
        if (waiting !== 0) {
          const result = `<p style='padding: 80px 0; text-align: center'>正在加载数据${''.padEnd(waiting % 4, '.')}</p>`;
          root.html(result);
          waiting++;
        }
      }, 1000);
      $.get('/index.php/user/ajax_ulog?ac=get&type=4', (resp) => {
        let result = "";
        if (resp.code !== 1) {
          result = `<p style='padding: 80px 0; text-align: center'>${resp.msg}</p>`;
        }else if (resp.total === 0) {
          result = "<p style='padding: 80px 0; text-align: center'>您还没有看过影片哦</p>";
        }else{
          const vods = resp.list.sort((a, b) => b.time - a.time);
          const dupUlogs = {};
          for (i = 0; i < vods.length; i++) {
            const vod = vods[i];
            if (vod.id in dupUlogs) { continue }
            dupUlogs[vod.id] = 1;
            const link = `/index.php/vod/play/id/${vod.id}.html?sid=${vod.sid}&nid=${vod.nid}`;
            result += `<p><a class='text-333' href='${link}' title='${vod.name}'><span class='pull-right text-red'>${vod.part}</span>${vod.name}</a></p>`;
          }
        }
        clearInterval(intervalId);
        waiting = 0;
        root.html(result);
      }).fail(x => {
        const result = "<p style='padding: 80px 0; text-align: center'>网络错误，请稍后重试。</p>";
        clearInterval(intervalId);
        waiting = 0;
        root.html(result);
      })
    },
    'Get': function () {
      var value = localStorage.getItem("history")
      if (value) {
        return JSON.parse(value) || [];
      } else {
        return [];
      }
    },
    'Set': function (name, link, pic, part, limit) {
      pic = "";
      if (!link) { link = document.URL; }
      let history = MyTheme.History.Get()
      let index = -1;
      const newItem = { name, link, pic, part };
      history = history.map((item, i) => {
        if (item.name === name) {
          index = i;
          return newItem;
        } else {
          return item;
        }
      })
      // 将数据移入队列最前面
      if (index === -1) {
        history.unshift(newItem);
      } else {
        const tmp = history.splice(index, 1);
        history.unshift(tmp[0]);
      }
      if (limit) {
        // 只保存limit个数据，多出来的要删除，同时要删除播放位置
        remove_history = history.slice(limit);
        if (remove_history.length) {
          history = history.slice(0, limit);
        }
      }
      localStorage.setItem("history", JSON.stringify(history));
    }
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
    },
    'Search': function () {
      $(".search-select p,.search-select li").click(function () {
        var action = $(this).attr("data-action");
        $("#search").attr("action", action);
        $(".search-select .text").text($(this).html());
      });
      $(".search_submit").click(function () {
        var value = $(".search_wd").val();
        if (!value) {
          var wd = $(".search_wd").attr("placeholder");
          $(".search_wd").val(wd);
        }
      });
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
  MyTheme.Images.Lazyload();
  MyTheme.Images.Flickity.Init();
  MyTheme.Link.Copy.Init();
  MyTheme.Link.Short();
  MyTheme.Other.Bootstrap();
  MyTheme.Other.Sort();
  MyTheme.Other.Search();
  MyTheme.Other.Collapse();
  MyTheme.Other.Slidedown();
  MyTheme.Other.Scrolltop();
  MyTheme.Other.Player();
  MyTheme.Other.Close();
});

window.addEventListener('message', function (e) {
  if (e.data == "ldgnext") {
    if (MacPlayer.PlayLinkNext != '') {
      location.href = MacPlayer.PlayLinkNext;
    }
  }
}, false);
