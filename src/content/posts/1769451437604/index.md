---
title: 一些PSQL语法
published: 2026-01-27
description: ""
image: ""
tags: []
category: ""
draft: false
lang: ""
---
因为看了全网最尊重MySQL的博主后把自己项目数据库换为PSQL了，记录一些语法。

语法是通用的吧，都是SQL语句。

# 排序：

`ORDER BY`

```sql
SELECT column1, column2 
FROM table_name 
ORDER BY column1 [ASC | DESC];
```

- **`ASC`**: 升序（从小到大），默认选项。
- **`DESC`**: 降序（从大到小）。

# 分页查询:

`OFFSET` 与 `LIMIT`

## OFFSET
跳过N行查询
## LIMIT
查询行数

```sql
SELECT * FROM products
ORDER BY id ASC
LIMIT 10 OFFSET 20;
```

跳过20行查询10页