# 占位符

占位符只是在属性值字符串中占个位置，并不出现在最终的属性值中。占位符可以是一个**数据生成函数** ，也可以是一个**字段引用**：

```javascript
@占位符(参数...) //占位符作为数据生成函数
@占位符  //占位符作为字段引用
```

**注：**

1. 占位符以@符开始，作为**数据生成器**时和函数调用语法一样，不传参数时**括号可省略**。
2. 占位符作为**字段引用**时，可以引用数据模版中的属性。
3. 占位符作为**字段引用**时，如果存在同名的数据生成器则会优先当作字段引用。
4. 占位符**不区分**大小写
5. 数据生成器生成的数据都是随机的。

```javascript
{
    "first": "@FIRST",
    "middle": "@FIRST",
    "last": "@LAST",
    "full": "@first @middle @last"//优先当作字段引用
}
```

## 常用内置的生成器

> mock.js 内置生成器很多，范围涵盖包括基本数据类型、日期、颜色、文本、名字、地址、web等等，下面列出几种常用的生成器，全部的生成器参考其官网。

| 生成器名称                              | 生成数据                                     |
| ---------------------------------- | ---------------------------------------- |
| bool                               | true/false                               |
| int(min?,max?)                     | 整形，范围在[min,max],若无参数，默认[ -9007199254740992, 9007199254740992] |
| float(min?,max?,dmin=0?, dmax=17?) | dmin和dmax分别为小数部分的最小值和最大值                 |
| string(pool?,min=3?,max=7?)        | pool 表示字符池，将从中选择字符返回，'lower' 、 'upper'、'number'、'symbol'， mix和max代表字符串的长度范围。 |
| cname                              | 生成一个中文人名                                 |
| email                              | 邮箱地址                                     |

全部的生成器戳这里 [mock.js生成器](https://github.com/nuysoft/Mock/wiki/Basic) 。

## Doris预置的生成器

尽管mock原有的生成器非常多，但还有一些常用的并没有覆盖，doris对生成器进行了扩充：

### phone

生成一个手机号码

### timeStamp(min=0?,max=0?)

生成一个时间戳，精确到毫秒, min和max代表时间戳的调整范围，**单位是天**，timeStamp会以当前时间为基准，然后加上一个 min到max之间的一个值。不传参数时默认为当前时间戳。

```javascript
@timeStamp(-2,2);//过去两天到将来两天之间的某一个时间
@timeStamp(5)//现在到将来5天之间的一个时间
```

## 示例

假设数据模版如下

```javascript
{
    "name":"@cname()", //名字
    "motion":"@csentence(3,50)",/*状态签名*/
    "age|0-200":0,//年龄，取值范围0-200
    "male|1":true,//性别，true为男性，false为女性
    "user_type|1":[1,3,7], //用户类型，只能是1,3,7中其中一个  
    "phone":"@phone()",//电话号码
    "email":"@email()",//邮箱
    "register_time":"@timestamp(-6)", //注册日期
    "address":"@county(true)"//住址
}
```

其中一次生成数据如下：

```javascript
{
  "errCode": 0,
  "data": {
    "name": "唐娜",
    "motion": "九民天至接命消术。",
    "age": 79,
    "male": false,
    "user_type": 3,
    "phone": "18511287453",
    "email": "l.cxirl@svdqrnoc.mg",
    "register_time": 1505237788183,
    "address": "青海省 海西蒙古族藏族自治州 都兰县"
  },
  "errMsg": "ok"
}
```

