# 数据模拟生成

Doris 是通过数据模版生成数据，模版为 jsonx 格式（doris 扩展后的 json)。数据模版应由开发人员定义，前端只需调用即可。

## JSONX

jsonx 是 doris 对 json格式的扩展，和标准的 json 语法有两点不同：

1. 支持注释
2. 支持 mock 语法

下面是一个模版例子：

```javascript
{
    "name":"@cname()", //名字
    "motion":"@csentence(3,50)",/*状态签名*/
    "age|0-200":0,//年龄，取值范围0-200
    "male|1":true,//性别，true为男性，false为女性
    "phone":"@phone()",//电话号码
    "email":"@email()",//邮箱
    "address":"@county(true)"//住址
}
```

可以看到jsonx允许你直接在字段后面加注释，对于一些只需简短说明的字段很直观，这对开发人员是很友好的。同时key里面的"|"和value中以"@"开头的是mock语法的标志。

## MOCK语法

Mock语法参照了 [mock.js ](https://github.com/nuysoft/Mock/wiki/Syntax-Specification) 的语法，包括数据模板定义规范（ Data Template Definition，DTD ）和 数据占位符定义规范（ Data Placeholder Definition，DPD ）两部分。

> doris采用mock.js的语法规则，并同时扩充了一些生成函数，但生成语法任然是兼容的，您也可以去查看mock.js官方文档 [mock.js语法定义 ](https://github.com/nuysoft/Mock/wiki/Syntax-Specification) 。

### 数据模板定义规范 DTD

数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：

```javascript
"name|rule":value
```

属性名( name )与生成规则( rule )之间是用竖线 “|”分割，生成规则是可选的，不存在时则和普通的key没有差别，主要内容是生成规则，生成规则根据具体值的类型而不同，下面分别说明：

**属性值是字符串 String**

`'name|min-max': string`

通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max。

`'name|count': string`

通过重复 string 生成一个字符串，重复次数等于 count。

**属性值是数字 Number**

`'name|+1': number`

属性值自动加 1，初始值为 number。

`'name|min-max': number`

生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型。

`'name|min-max.dmin-dmax': number`

生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位。

```javascript
{
	"number1|1-100.1-10": 1,
	"number2|123.1-10": 1,
	"number3|123.3": 1,
	"number4|123.10": 1.123
}
```
生成后的数据
```javascript
{
	"number1": 12.92,
	"number2": 123.51,
	"number3": 123.777,
	"number4": 123.1231091814
}
```
**属性值是布尔型 Boolean**

`'name|1': boolean`

随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2。

`'name|min-max': value`

随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)。

**属性值是对象 Object**

`'name|count': object`

从属性值 object 中随机选取 count 个属性。

`'name|min-max': object`

从属性值 object 中随机选取 min 到 max 个属性。

**属性值是数组 Array**

`'name|1': array`

从属性值 array 中随机选取 1 个元素，作为最终值。

`'name|+1': array`

从属性值 array 中顺序选取 1 个元素，作为最终值。

`'name|min-max': array`

通过重复属性值 array 生成一个新数组，重复次数大于等于 min，小于等于 max。

`'name|count': array`

通过重复属性值 array 生成一个新数组，重复次数为 count。

