@echo off
:again
cls
echo.
echo.
echo ######################请选择要执行的操作######################
echo ----------------------1、输入数字1，git status----------------------
echo ----------------------2、输入数字5，git pull------------------------
echo ----------------------3、输入数字3，git add\commit\push--------
echo ----------------------4、输入空格 ，终止批处理   ------------------
echo ----------------------5、输入数字2，终止关机   --------------------
echo ----------------------6、输入数字6，一分钟后关机   ----------------
echo ----------------------7、输入数字7，电脑休眠   --------------------
echo ----------------------11、输入数字11，运行源码   --------------------
echo.
echo.
echo 请选择要执行的操作或按回车执行自定义命令
set /p num=
set times=%date:~0,4%/%date:~5,2%/%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%
  
if "%num%"=="1" (
cls
echo.
echo.
echo 当前git 状态：
git status
pause
goto again
)
if "%num%"==" " (
goto
)
if "%num%"=="5" (
cls
echo.
echo.
echo 拉取远程仓库：
git pull
pause
goto again
)

if "%num%"=="3" (
cls
echo.
echo.
git add . && echo "git add ok" && echo "======" && git commit -m "matou update at %times%" && echo "======" && git push
pause
goto again
)

if "%num%"=="2" (
cls
echo.
echo.
echo 终止关机：
shutdown -a
pause
goto again
)

if "%num%"=="6" (
cls
echo.
echo.
echo 1分钟后关闭电脑：
shutdown -s
pause
goto again
)

if "%num%"=="7" (
cls
echo.
echo.
echo 休眠电脑：
shutdown -h
pause
goto again
)

if "%num%"=="11" (
  cls
  echo.
  echo.
  echo idea running... ...：
  START idea64 %cd%
  @ping /n 70 127.0.0.1 >nul
  echo cd vue3-ui, idea running... ...：
  code %cd%/vue3-ui
  @ping /n 20 127.0.0.1 >nul
  cd vue3-ui
  yarn dev
)

echo.
:mycmd
echo 请输入并执行自定义命令；按 1 返回主菜单；按回车结束cmd
set /p dd=
if "%dd%"=="" goto
if "%dd%"=="1" goto again

echo 开始执行命令：%dd%  ... ...
CALL %dd%
echo 命令执行结束
goto mycmd

