@echo off
:again
cls
echo.
echo.
echo ######################��ѡ��Ҫִ�еĲ���######################
echo ----------------------1����������1��git status----------------------
echo ----------------------2����������5��git pull------------------------
echo ----------------------3����������3��git add\commit\push--------
echo ----------------------4������ո� ����ֹ������   ------------------
echo ----------------------5����������2����ֹ�ػ�   --------------------
echo ----------------------6����������6��һ���Ӻ�ػ�   ----------------
echo ----------------------7����������7����������   --------------------
echo ----------------------11����������11������Դ��   --------------------
echo.
echo.
echo ��ѡ��Ҫִ�еĲ����򰴻س�ִ���Զ�������
set /p num=
set times=%date:~0,4%/%date:~5,2%/%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%
  
if "%num%"=="1" (
cls
echo.
echo.
echo ��ǰgit ״̬��
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
echo ��ȡԶ�ֿ̲⣺
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
echo ��ֹ�ػ���
shutdown -a
pause
goto again
)

if "%num%"=="6" (
cls
echo.
echo.
echo 1���Ӻ�رյ��ԣ�
shutdown -s
pause
goto again
)

if "%num%"=="7" (
cls
echo.
echo.
echo ���ߵ��ԣ�
shutdown -h
pause
goto again
)

if "%num%"=="11" (
  cls
  echo.
  echo.
  echo idea running... ...��
  START idea64 %cd%
  @ping /n 70 127.0.0.1 >nul
  echo cd vue3-ui, idea running... ...��
  code %cd%/vue3-ui
  @ping /n 20 127.0.0.1 >nul
  cd vue3-ui
  yarn dev
)

echo.
:mycmd
echo �����벢ִ���Զ�������� 1 �������˵������س�����cmd
set /p dd=
if "%dd%"=="" goto
if "%dd%"=="1" goto again

echo ��ʼִ�����%dd%  ... ...
CALL %dd%
echo ����ִ�н���
goto mycmd

