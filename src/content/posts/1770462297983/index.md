---
title: 终末地获取寻访记录接口
published: 2026-02-07
description: 这期神了
image: ""
tags:
  - 开发日记
category: 我思
draft: false
lang: zh-CN
---
# 前言

终末地仅可在游戏中获取寻访记录，所以我们需要抓包来进行逆向。

# 登录

登录目前有以下几种：

验证码，密码，扫码

## 验证码登录

```HTTP
POST https://as.hypergryph.com/general/v1/send_phone_code
```

### 请求体

```JSON
{
  "phone": "这里是手机号",
  "type": 2
}
```

### 返回内容（成功）

```json
{
  "msg": "OK",
  "status": 0,
  "type": "A"
}
```

### 返回内容（频繁）

```json
{

    "msg": "发送频率太高，请稍后再试",

    "status": 102,

    "type": "C1"

}
```

### 获取Token

```HTTP
POST https://as.hypergryph.com/user/auth/v2/token_by_phone_code
```

## 请求头

| X-DeviceId    | 随机数字/字母，长度不限，建议10字符左右 |
| ------------- | --------------------- |
| X-DeviceModel | 随机数字/字母，设备名           |
| X-DeviceType  | 2                     |

## 请求体

```json
{
  "appCode": "dd7b852d5f1dd9da",
  "code": "验证码",
  "phone": "手机号"
}
```

## 响应体

```json
{
  "data": {
    "token": "这里是token",
    "hgId": "这里是hgid",
    "deviceToken": "这里是设备token"
  },
  "msg": "OK",
  "status": 0,
  "type": "A"
}
```

## 密码登录

```HTTP
POST https://as.hypergryph.com/user/auth/v1/token_by_phone_password
```

### 请求体

不知道为什么，没做加密

```json
{
  "password": "密码",
  "phone": "手机号"
}
```


### 响应体

```json
{
  "data": {
    "token": "头肯"
  },
  "msg": "OK",
  "status": 0,
  "type": "A"
}
```

但问题来了，我们无法获取到设备token。

疑似新设备登录必须使用验证码，因为只有验证码接口才会返回设备Token.

而验证码返回的设备token可以在下一步使用密码获取的token来得到code

也就是验证码获取设备token，密码获取token，获取code需要设备token与token

那为什么不直接验证码登录呢。。

## 扫码登录

### 获取二维码

```HTTP
POST https://as.hypergryph.com/general/v1/gen_scan/login
```

### 请求体

```json
{
  "appCode": "dd7b852d5f1dd9da"
}
```

### 响应体

```json
{
  "data": {
    "scanId": "此次登录ID",
    "scanUrl": "hypergryph://scan_login?scanId=12345",
    "enableScanAppList": [
      {
        "appCode": "4ca99fa6b56cc2ba",
        "name": "森空岛",
        "iconUrl": "https://web.hycdn.cn/biz_toolset/upload/251225/qYm0f7X8LMaLkRRL.jpg"
      },
      {
        "appCode": "dd7b852d5f1dd9da",
        "name": "明日方舟：终末地",
        "iconUrl": "https://web.hycdn.cn/biz_toolset/upload/251225/7ms6XmvZH1GfZT11.jpg"
      }
    ]
  },
  "msg": "OK",
  "status": 0,
  "type": "A"
}
```

注意到，scanUrl并不是普通的url，而是内部链接，我们需要生成这个链接的二维码扫码，生成的二维码格式为文本哦

### 轮询二维码状态

```HTTP
GET https://as.hypergryph.com/general/v1/scan_status?scanId=这里是上一步的scanId
```

### 响应体（未扫码）

```json
{
  "msg": "未扫码",
  "status": 100,
  "type": "A"
}
```

### 响应体（已扫码）

```json
{
  "data": {
    "scanCode": "asdasfasdasodasdasd"
  },
  "msg": "OK",
  "status": 0,
  "type": "A"
}
```


### 通过scanCode获取Token

```HTTP
POST https://as.hypergryph.com/user/auth/v1/token_by_scan_code
```

#### 请求头

| X-DeviceId    | 随机数字/字母，长度不限，建议10字符左右 |
| ------------- | --------------------- |
| X-DeviceModel | 随机数字/字母，设备名           |
| X-DeviceType  | 2                     |
#### 请求体

```json
{
  "appCode": "dd7b852d5f1dd9da",
  "from": 0,
  "scanCode": "上一步的"
}
```

#### 响应体

```json
{
  "data": {
    "token": "token",
    "hgId": "这是啥我也不知道",
    "deviceToken": "设备token"
  },
  "msg": "OK",
  "status": 0,
  "type": "A"
}
```

## 人机验证

在登陆时，有概率风控，以手机号登录为例：

请求发送验证码时，返回：

```json
{
    "data": {
        "captcha": {
            "challenge": "123",
            "success": 1,
            "gt": "123",
            "new_captcha": true
        }
    },
    "msg": "需要人机验证",
    "status": 1,
    "type": "A"
}
```

那么我们需要进行人机验证，然后再次请求。

鹰角使用的[geetest](https://docs.geetest.com/sensebot/deploy/client/web)提供的人机验证服务

那么我们可以写一个HTML页面，来接入后获取验证完毕的参数

```html
<!doctype html>

<html lang="en">

  <head>

    <script src="https://static.geetest.com/static/js/gt.0.5.0.js"></script>

    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Document</title>

  </head>

  <body>

    <div id="captcha-box"></div>

  </body>

  <footer>

    <script>

      var captchaBox = document.getElementById("captcha-box");

      setTimeout(() => {

        initGeetest(

          {

            // 以下配置参数来自服务端 SDK

            gt: "上文的gt",

            challenge: "上文的challenge",

            offline: false,

            new_captcha: true,

            api_server: "api.geevisit.com", //非必须参数，添加此字段用于修改极验api域名

          },

          function (captchaObj) {

            captchaObj.appendTo(captchaBox);

            captchaObj.onSuccess(function () {

              var result = captchaObj.getValidate();

              console.log(result)

            });

          },

        );

      }, 1000);

    </script>

  </footer>

</html>
```

当验证完毕后，控制台会返回

```json
{

        "geetest_challenge": "123",

        "geetest_validate": "456",

        "geetest_seccode": "789|asd"

}
```

你也可以自行修改以下函数来自定义：

```js
            captchaObj.onSuccess(function () {

              var result = captchaObj.getValidate();

              console.log(result)

            });
```

只是提供思路，不要照抄哦

我们需要将控制台返回的三个字段加入发送验证码的请求中重新发送即可

```json
{

    "phone": "手机号",

    "type": 2,

    "captcha": {

        "geetest_challenge": "123",

        "geetest_validate": "456",

        "geetest_seccode": "789|asd"

    }

}
```
# Token获取Code

```HTTP
POST https://as.hypergryph.com/user/oauth2/v2/grant
```

## 请求体

```json
{

  "appCode": "dd7b852d5f1dd9da",

  "deviceToken": "上一步的设备token",

  "token": "上一步的token",

  "type": 0

}
```

## 响应内容

```json
{

    "data": {

        "uid": "这里的uid并不是真实uid",

        "code": "返回的code,看着像base64"

    },

    "msg": "OK",

    "status": 0,

    "type": "A"

}
```

# 获取最终Token

```HTTP
POST https://u8.hypergryph.com/u8/user/auth/v2/token_by_channel_token
```

## 请求体

```json
{
  "appCode": "4df8f5a7c2ad711b497a",
  "channelMasterId": "1",
  "channelToken": "{\"code\":\"这里是上一步获取到的code\",\"type\":1,\"isSuc\":true}",
  "type": 0,
  "platform": 2
}
```

## 响应内容

```json
{

    "data": {

        "token": "这里的一大坨是token",

        "isNew": false,

        "uid": "这里的UID并不是游戏uid"

    },

    "msg": "OK",

    "status": 0,

    "type": ""

}
```

# 获取寻访内容

:::warning
请求url参数中的token请进行url编码！！！否则会提示token无效
:::

:::warning
请求url参数中的token请进行url编码！！！否则会提示token无效
:::

:::warning
请求url参数中的token请进行url编码！！！否则会提示token无效
:::

## 角色池

```HTTP
GET https://ef-webview.hypergryph.com/api/record/char
```

## URL参数


| 参数        | 必填    | 类型     |
| --------- | ----- | ------ |
| lang      | true  | string |
| pool_type | true  | string |
| token     | true  | string |
| server_id | true  | int    |
| seq_id    | false | int    |

### 参数讲解

#### lang

返回的语言，支持：

zh-cn, en-us, ja-jp, ko-kr, zh-tw, es-mx, pt-br, fr-fr, de-de, ru-ru, it-it, id-id, th-th, vi-vn

#### pool_type

池子类型，支持：

- E_CharacterGachaPoolType_Standard
- 常驻
- E_CharacterGachaPoolType_Special
- 限定
- E_CharacterGachaPoolType_Beginner
- 新手

#### token

最终token，记得一定要url编码！

#### server_id

填1即可，不知道值

#### seq_id

池子页数，具体请看[参数详情](#参数详情)

## 返回体

```json
{

    "code": 0,

    "data": {

        "list": [

            {

                "poolId": "special_1_0_3",

                "poolName": "轻飘飘的信使",

                "charId": "chr_0022_bounda",

                "charName": "萤石",

                "rarity": 4,

                "isFree": false,

                "isNew": false,

                "gachaTs": "1770446953233",

                "seqId": "311"

            },

            {

                "poolId": "special_1_0_3",

                "poolName": "轻飘飘的信使",

                "charId": "chr_0018_dapan",

                "charName": "大潘",

                "rarity": 5,

                "isFree": false,

                "isNew": false,

                "gachaTs": "1770446953233",

                "seqId": "310"

            },

            {

                "poolId": "special_1_0_3",

                "poolName": "轻飘飘的信使",

                "charId": "chr_0023_antal",

                "charName": "安塔尔",

                "rarity": 4,

                "isFree": false,

                "isNew": false,

                "gachaTs": "1770446953233",

                "seqId": "309"

            },

            {

                "poolId": "special_1_0_3",

                "poolName": "轻飘飘的信使",

                "charId": "chr_0020_meurs",

                "charName": "卡契尔",

                "rarity": 4,

                "isFree": false,

                "isNew": false,

                "gachaTs": "1770446953233",

                "seqId": "308"

            },

            {

                "poolId": "special_1_0_3",

                "poolName": "轻飘飘的信使",

                "charId": "chr_0019_karin",

                "charName": "秋栗",

                "rarity": 4,

                "isFree": false,

                "isNew": false,

                "gachaTs": "1770446953233",

                "seqId": "307"

            }

        ],

        "hasMore": true

    },

    "msg": ""

}
```

## 参数详情

- poolId：池子ID
- charId：角色id
- rarity：角色星数
- isFree：免费抽数吗？（免费抽数不记录保底）
- isNew：新获取的吗
- sql_Id：请求id，如果要请求此角色以后的五个角色，就使用此id（一般使用最后一个角色的seqId来获取下一页内容）
- hasMore：是否还有更多


## 武器池

### 获取武器池列表

好像只展示你抽过的

```HTTP
GET https://ef-webview.hypergryph.com/api/record/weapon/pool
```

#### 参数

| lang      | 看上文的url参数 |
| --------- | --------- |
| token     | 看上文的url参数 |
| server_id | 1         |

#### 返回体

```json
{
  "code": 0,
  "data": [
    {
      "poolId": "weponbox_1_0_3",
      "poolName": "迅行申领"
    },
    {
      "poolId": "weponbox_1_0_1",
      "poolName": "熔铸申领"
    },
    {
      "poolId": "weaponbox_constant_2",
      "poolName": "星声申领"
    },
    {
      "poolId": "weaponbox_constant_3",
      "poolName": "远途申领"
    }
  ],
  "msg": ""
}
```

### 获取池子记录

```HTTP
GET https://ef-webview.hypergryph.com/api/record/weapon
```

#### 参数

| lang      | 同上文                        |
| --------- | -------------------------- |
| pool_id   | 获取到的池子记录中的poolId，如果不填，则是全部 |
| token     | 同上文                        |
| server_id | 1                          |
| seq_id    | 同上文                        |

### 返回体

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "poolId": "weponbox_1_0_3",
        "poolName": "迅行申领",
        "weaponId": "wpn_claym_0003",
        "weaponName": "工业零点一",
        "weaponType": "E_WeaponType_Claymores",
        "rarity": 4,
        "isNew": false,
        "gachaTs": "1770446778817",
        "seqId": "130"
      },
      {
        "poolId": "weponbox_1_0_3",
        "poolName": "迅行申领",
        "weaponId": "wpn_funnel_0005",
        "weaponName": "悼亡诗",
        "weaponType": "E_WeaponType_Wand",
        "rarity": 5,
        "isNew": false,
        "gachaTs": "1770446778817",
        "seqId": "129"
      },
      {
        "poolId": "weponbox_1_0_3",
        "poolName": "迅行申领",
        "weaponId": "wpn_sword_0009",
        "weaponName": "浪潮",
        "weaponType": "E_WeaponType_Sword",
        "rarity": 4,
        "isNew": false,
        "gachaTs": "1770446778817",
        "seqId": "128"
      },
      {
        "poolId": "weponbox_1_0_3",
        "poolName": "迅行申领",
        "weaponId": "wpn_funnel_0001",
        "weaponName": "全自动骇新星",
        "weaponType": "E_WeaponType_Wand",
        "rarity": 4,
        "isNew": false,
        "gachaTs": "1770446778817",
        "seqId": "127"
      },
      {
        "poolId": "weponbox_1_0_3",
        "poolName": "迅行申领",
        "weaponId": "wpn_lance_0008",
        "weaponName": "天使杀手",
        "weaponType": "E_WeaponType_Lance",
        "rarity": 4,
        "isNew": false,
        "gachaTs": "1770446778817",
        "seqId": "126"
      }
    ],
    "hasMore": true
  },
  "msg": ""
}
```

返回的参数和上文一样。


# 后日谈

这期神了！