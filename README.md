# 初始化项目



### 1.composer 安装扩展

------------
~~~
composer install
~~~

### 2.init 初始化

------------
~~~
php ./init
~~~
根据提示选择对应环境进行项目首次初始化


  

-------------------

#### 当前项目中存在的环境配置有 
- 开发(Development)
- 生产(Production)
- 测试(Test)

#### 注意:

-------------------
+ 开发环境和测试环境目前是一套环境
+ 对应在环境目录下的environments目录下
+ 其映射关系保存在/environments/index.php中
+ 如需要区分正式/测试环境的配置，请在environments目录下对应的local配置文件中配置，切勿在项目的params-local|main-local配置文件中直接设置
  
+ 配置environments的时候，请一式三份，测试（Test）/开发（Development）/正式（Production）中进行对应配置，防止环境配置丢失
```
environments
    dev/              contains shared configurations
    prod/                contains view files for e-mails
    test/              contains model classes used in both backend and frontend
  
```