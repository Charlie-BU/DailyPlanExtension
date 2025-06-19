from selenium import webdriver
import time

driver = webdriver.Chrome()
driver.get("https://todos.woyaozuojihua.com/pc/#/view")  # 目标网页

# 设置 LocalStorage 中的 Token
token_value = ""
driver.execute_script(f"window.localStorage.setItem('todo_list_userToken', '{token_value}');")
driver.refresh()

time.sleep(2)
html = driver.page_source

with open("logged_in_page.html", "w", encoding="utf-8") as file:
    file.write(html)
driver.quit()
