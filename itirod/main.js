window.onpopstate = function(event) {
  alert("kek: " + event.state);
};

var currentUser = null;

var links = null; //Создаём переменную, в которой будут храниться ссылки

var loaded = true; //Переменная, которая обозначает, загрузилась ли страница

var data = //Данные о странице
{
    title: "",
    body: "",
    link: ""
};

var html = document.getElementById("html")

function InitLinks()
{
    links = document.getElementsByClassName("link_internal"); //Находим все ссылки на странице

    for (var i = 0; i < links.length; i++)
    {
   	 //Отключаем событие по умолчанию и вызываем функцию LinkClick
   	 links[i].addEventListener("click", function (e) {
   		 e.preventDefault();
   		 LinkClick(e.target.getAttribute("href"));  
   		 return false;
   	 });
    }
}

function openCalendar() {
  SendRequest("https://newboba-itirod.web.app/html/calendar.html", function() {
    var newScript = document.createElement("script");
    newScript.src = "./js/calendar.js"
    html.appendChild(newScript);
  });
}

function SendRequest(link, callback)
{
    var xhr = new XMLHttpRequest(); //Создаём объект для отправки запроса

    // xhr.open("GET", "/inner/" + link, true); //Открываем соединение
    // console.log(link)
    xhr.open("GET", link, true); //Открываем соединение

    xhr.onreadystatechange = function() {
   	 if (xhr.readyState != 4) return; //Если это не тот ответ, который нам нужен, ничего не делаем

   	 //Иначе говорим, что сайт загрузился
   	 loaded = true;

   	 if (xhr.status == 200) //Если ошибок нет, то получаем данные
   	 {
       GetData(xhr.responseText, link);
       callback()
   	 }
   	 else //Иначе выводим сообщение об ошибке
   	 {
   		 alert("Loading error! Try again later.");
   		 console.log(xhr.status + ": " + xhr.statusText);
   	 }
    }

    loaded = false; //Говорим, что идёт загрузка

    //Устанавливаем таймер, который покажет сообщение о загрузке, если она не завершится через 2 секунды
    // setTimeout(ShowLoading, 2000);
    xhr.send(); //Отправляем запрос
}

function GetData(response, link) //Получаем данные
{
  html.innerHTML = response
  // UpdatePage(); //Обновляем контент на странице
}

function ShowLoading()
{
    if(!loaded) //Если страница ещё не загрузилась, то выводим сообщение о загрузке
    {
   	 page.body.innerHTML = "Loading...";
    }
}

function UpdatePage() //Обновление контента
{
  // updateElement(page.head, data.head)
  // updateElement(page.header, data.header)
  // updateElement(page.main, data.main)
  // updateElement(page.popups, data.popups)
  // updateElement(page.scripts, data.scripts)

  // window.history.pushState(data, "", data.link); //Меняем ссылку

  // InitLinks(); //Инициализируем новые ссылки
}

function updateElement(element, value) {
  if (value != null) {
    element.innerHTML = value
  }
}