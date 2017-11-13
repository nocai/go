package key

import (
	"bytes"
	"strconv"
)

//type Key interface {
//	GetPage() int64
//	GetRows() int64
//	GetOrderBySql() string
//	GetLimitSql() string
//}

type Key struct {
	page int64
	rows int64

	sort  []string
	order []string
}

func (key Key) GetPage() int64 {
	return key.page
}

func (key Key) GetRows() int64 {
	return key.rows
}

func (key *Key) GetOrderBySql(alias string) string {
	if len(key.sort) > 0 && len(key.order) > 0 {
		var sql bytes.Buffer
		sql.WriteString(" order by")
		for i := 0; i < len(key.sort); i++ {
			s := key.sort[i]
			o := key.order[i]
			if s == "" || o == "" {
				if alias != "" {
					sql.WriteString(" ")
					sql.WriteString(alias)
					sql.WriteString(".")
					sql.WriteString("id desc")
					return sql.String()
				}
				sql.WriteString(" id desc")
				return sql.String()
			}

			sql.WriteString(" ")
			if alias != "" {
				sql.WriteString(alias)
				sql.WriteString(".")
			}
			sql.WriteString(s)
			sql.WriteString(" ")
			sql.WriteString(o)
			if i != len(key.sort)-1 {
				sql.WriteString(",")
			}
		}
		return sql.String()
	}
	if alias != "" {
		return " " + alias + ".id desc"
	}
	return " id desc"
}

func (key *Key) GetLimitSql() string {
	if key.page > 0 && key.rows > 0 {
		startIndex := (key.page - 1) * key.rows
		return " limit " + strconv.FormatInt(startIndex, 10) + ", " + strconv.FormatInt(key.rows, 10)
	}
	return ""
}

func New(page, rows int64, sort, order []string) *Key {
	if len(sort) != len(order) {
		panic("sort 与 order 长度不相等")
	}
	return &Key{page: page, rows: rows, sort: sort, order: order}
}
