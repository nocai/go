package models

import (
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
	"time"
	"github.com/astaxie/beego"
)

func init() {
	//orm.RegisterDataBase("default", "mysql", "devel:devel@tcp(139.196.191.164:3306)/mgr?charset=utf8", 30)
	mysqluser := beego.AppConfig.String("mysqluser")
	mysqlpass := beego.AppConfig.String("mysqlpass")
	//mysqlurls := beego.AppConfig.String("mysqlurls")
	mysqldb := beego.AppConfig.String("mysqldb")
	orm.RegisterDataBase("default", "mysql", mysqluser + ":" + mysqlpass +"@/" + mysqldb + "?charset=utf8", 30)
	// register model
	//orm.RegisterModelWithPrefix("t_mgr_", new(User), new(role.Role), new(AdminRoleRef), new(Admin), new(Res))
	orm.RegisterModelWithPrefix("t_mgr_", new(Role), new(User), new(Admin))

	// create table
	orm.RunSyncdb("default", false, true)

	orm.Debug = true
}


// 所有模型共同的属性.
// create_time.
// update_time
type ModelBase struct {
	CreateTime time.Time  `json:"create_time"`
	UpdateTime time.Time `json:"update_time"`
}
