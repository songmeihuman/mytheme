﻿// var killErrors=function(value){return true};window.onerror=null;window.onerror=killErrors;

var MacPlayer = {
    'GetDate': function (f, t) {
        if (!t) {
            t = new Date()
        }
        var a = ['日', '一', '二', '三', '四', '五', '六'];
        f = f.replace(/yyyy|YYYY/, t.getFullYear());
        f = f.replace(/yy|YY/, (t.getYear() % 100) > 9 ? (t.getYear() % 100).toString() : '0' + (t.getYear() % 100));
        f = f.replace(/MM/, t.getMonth() > 9 ? t.getMonth().toString() : '0' + t.getMonth());
        f = f.replace(/M/g, t.getMonth());
        f = f.replace(/w|W/g, a[t.getDay()]);
        f = f.replace(/dd|DD/, t.getDate() > 9 ? t.getDate().toString() : '0' + t.getDate());
        f = f.replace(/d|D/g, t.getDate());
        f = f.replace(/hh|HH/, t.getHours() > 9 ? t.getHours().toString() : '0' + t.getHours());
        f = f.replace(/h|H/g, t.getHours());
        f = f.replace(/mm/, t.getMinutes() > 9 ? t.getMinutes().toString() : '0' + t.getMinutes());
        f = f.replace(/m/g, t.getMinutes());
        f = f.replace(/ss|SS/, t.getSeconds() > 9 ? t.getSeconds().toString() : '0' + t.getSeconds());
        f = f.replace(/s|S/g, t.getSeconds());
        return f
    }, 'GetUrl': function (s, n) {
        return this.Link.replace('{sid}', s).replace('{sid}', s).replace('{nid}', n).replace('{nid}', n)
    }, 'Go': function (s, n) {
        location.href = this.GetUrl(s, n)
    }, 'Show': function () {
        $('#buffer').attr('src', this.Prestrain);
        setTimeout(function () {
            MacPlayer.AdsEnd()
        }, this.Second * 1000);
        //$("#playleft").get(0).innerHTML = this.Html + '';
        //$("#playleft iframe").attr("src", "/static/player/dplayer.html");
    }, 'AdsStart': function () {
        if ($("#buffer").attr('src') != this.Buffer) {
            $("#buffer").attr('src', this.Buffer)
        }
        $("#buffer").show()
    }, 'AdsEnd': function () {
        $('#buffer').hide()
    }, 'Play': function () {
        //document.write('<style>.MacPlayer{background: #000000;font-size:14px;color:#F6F6F6;margin:0px;padding:0px;position:relative;overflow:hidden;width:' + this.Width + ';height:' + this.Height + ';min-height:100px;}.MacPlayer table{width:100%;height:100%;}.MacPlayer #playleft{position:inherit;!important;width:100%;height:100%;}</style><div class="MacPlayer">' + '<iframe id="buffer" src="" frameBorder="0" scrolling="no" width="100%" height="100%" style="position:absolute;z-index:99998;"></iframe>' + '<table border="0" cellpadding="0" cellspacing="0"><tr><td id="playleft" valign="top" style="">&nbsp;</td></table></div>');
        this.offsetHeight = $('.MacPlayer').get(0).offsetHeight;
        this.offsetWidth = $('.MacPlayer').get(0).offsetWidth;
        //MacPlayer.Html = '<iframe border="0" src="' + maccms.path + '/static/player/dplayer.html" width="100%" height="100%" marginWidth="0" frameSpacing="0" marginHeight="0" frameBorder="0" scrolling="no" vspale="0" noResize allow="autoplay; fullscreen"></iframe>';
        MacPlayer.Show();
    }, 'Down': function () {
    }, 'Init': function () {
        this.Status = true;
        this.Parse = '';
        var a;
        if (typeof player_data != "undefined") {
            a = player_data;
        } else {
            a = player_aaaa;
        }
        if (a.encrypt == '1') {
            a.url = unescape(a.url);
            a.url_next = unescape(a.url_next)
        } else if (a.encrypt == '2') {
            a.url = unescape(atob(a.url));
            a.url_next = unescape(atob(a.url_next))
        }
        this.Agent = navigator.userAgent.toLowerCase();
        this.Width = MacPlayerConfig.width;
        this.Height = MacPlayerConfig.height;
        if (this.Agent.indexOf("android") > 0 || this.Agent.indexOf("mobile") > 0 || this.Agent.indexOf("ipod") > 0 || this.Agent.indexOf("ios") > 0 || this.Agent.indexOf("iphone") > 0 || this.Agent.indexOf("ipad") > 0) {
            this.Width = MacPlayerConfig.widthmob;
            this.Height = MacPlayerConfig.heightmob
        }
        if (this.Width.indexOf("px") == -1 && this.Width.indexOf("%") == -1) {
            this.Width = '100%'
        }
        if (this.Height.indexOf("px") == -1 && this.Height.indexOf("%") == -1) {
            this.Height = '100%'
        }
        this.Prestrain = MacPlayerConfig.prestrain;
        this.Buffer = MacPlayerConfig.buffer;
        this.Second = MacPlayerConfig.second;
        this.Flag = a.flag;
        this.Trysee = a.trysee;
        this.Points = a.points;
        this.Link = decodeURIComponent(a.link);
        this.PlayFrom = a.from;
        this.PlayNote = a.note;
        this.PlayServer = a.server == 'no' ? '' : a.server;
        this.PlayUrl = a.url;
        this.PlayUrlNext = a.url_next;
        this.PlayLinkNext = a.link_next;
        this.PlayLinkPre = a.link_pre;
        this.Id = a.id;
        this.Sid = a.sid;
        this.Nid = a.nid;
        if (MacPlayerConfig.server_list[this.PlayServer] != undefined) {
            this.PlayServer = MacPlayerConfig.server_list[this.PlayServer].des
        }
        if (MacPlayerConfig.player_list[this.PlayFrom] != undefined) {
            if (MacPlayerConfig.player_list[this.PlayFrom].ps == "1") {
                this.Parse = MacPlayerConfig.player_list[this.PlayFrom].parse == '' ? MacPlayerConfig.parse : MacPlayerConfig.player_list[this.PlayFrom].parse;
                this.PlayFrom = 'parse'
            }
        }
        this.Path = (maccms.base_url || maccms.path) + '/static/player/';
        if (this.Flag == "down") {
            MacPlayer.Down()
        } else {
            MacPlayer.Play()
        }
    }
};

MacPlayer.Init();
