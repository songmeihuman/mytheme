$(document).ready(function() {
  function showMsg(msg) {
    layer.open({
      title: '',
      content: msg
    })
  }
  // 
  let lastRefreshTime = new Date().getTime();
  function refreshVerifyImg() {
    const self = document.querySelector("#verify_img");
    const now = new Date().getTime();
    if (!self) return;
    if (now - lastRefreshTime < 3000) {
      layer.msg("请勿频繁刷新验证码，稍等 3 秒后可以刷新！")
      return
    }
    lastRefreshTime = now
    const src = new URL(self.src)
    self.src = `//${src.host}${src.pathname}?t=${now}`
  }
  //
  var countdown=60;
  function settime(val) {
    if (countdown == 0) {
        val.removeAttribute("disabled");
        $(val).text("发送")
        countdown = 60;
        return true;
    } else {
        val.setAttribute("disabled", true);
        $(val).text(countdown)
        countdown--;
    }
    setTimeout(function() {settime(val) },1000)
  }
  $("body").bind('keyup',function(event) {
    if(event.keyCode==13){ $('#btn_submit').click(); }
  });
  const validDomains = [
    "163.com",
    "126.com",
    "139.com",
    "sina.com",
    "sina.cn",
    "yeah.com",
    "yeah.net",
    "88.com",
    "111.com",
    "qq.com",
    "foxmail.com",
    "outlook.com",
    "gmail.com",
    "foxmail.com",
    "protonmail.com",
    "mac.com",
    "me.com",
    "icloud.com",
  ]

  function post(elm, url, data) {
    var elmText = elm.text();
    var loading = layer.load();
    elm.attr('disabled', true).css("background","#fd6a6a").val("loading...");
    return $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: data,
        complete: function () {
          layer.close(loading);
          elm.removeAttr('disabled').css("background","#0568C1").val(elmText);
        }
    });
  }

  $('.send_msg').click(function(){
    var ac = 'email';
    var to = $('input[name="to"]').val();
    var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var ex = pattern.test(to);
    if (!ex) {
      showMsg('邮箱格式不正确');
      return;
    }
    if (!validDomains.includes(to.split('@')[1])) {
      showMsg('暂不支持这个邮箱域名，推荐使用QQ邮箱或Gmail邮箱');
      return
    }
    var turnsiteResponse = $('#fm').find('input[name="cf-turnstile-response"]').val();
    if (turnsiteResponse !== undefined && turnsiteResponse.length === 0) {
      showMsg('请先进行人机验证');
      return
    }

    var button = this
    var data = $("#fm").serialize();
    var elm = $(this);
    post(elm, elm.attr('data-action'), data)
    .done(function(r) {
      settime(button);
      layer.msg(r.msg);
    })
  });

  $('.btn_submit').click(function() {
    // 用户只能包含字母、数字、常用字符。大于6位。不能包含admin等
    const regexName = /^[a-zA-Z][a-zA-Z0-9_]{5,}$/;
    if (!regexName.test($('input[name="user_name"]').val())) {
      showMsg("账号只能是字母+数字+下划线，必须以字母开头，且大于6位")
      return
    }
    var elm = $(this);
    var fm = $("#fm");
    post(elm, fm.attr('action'), fm.serialize())
    .done(function(r) {
      if(r.code==1){
        layer.confirm(r.msg, index => {
          layer.close(index);
        });
        location.href = "/";
      } else{
        layer.confirm(r.msg);
        refreshVerifyImg();
      }
    })
  });
})