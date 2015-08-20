(function($) {
  var deleteButton = "<button class='delete btn btn-danger'>Delete</button>";
  var editButton = "<button class='edit btn btn-warning'>Edit</button>";
  var twoButtons = " <div class='btn-group'>" + editButton + deleteButton + "</div>";

  var addToPage = function (id, text, checked) {
    var htmlId = "task-" + id;
    var html = "<li id='" + htmlId + "' class='list-group-item'>";
    html += "<input class='checkbox' type='checkbox'";
    if(checked) html += " checked";
    html += ">  ";
    html += text;
    html += twoButtons;
    html += "</li>";
    $(".list_of_items").append(html);
    $("#"+htmlId)
    .on("click", ".edit", editClick)
    .on("click", ".delete", deleteClick)
    .on("click", ".checkbox", checkboxChange);
  }

  var addItem = function(listId, taskId, description) {
    var data = { description: description, done: false, list: listId };
    io.socket.post('/task/' + taskId, data, function(res, JWR) {
      if(JWR.statusCode >= 300) console.log("Error Selecting Item");
    });
  }
  var deleteItem = function(taskId) {
    io.socket.delete('/task/' + taskId, function(res, JWR) {
      if(JWR.statusCode >= 300) console.log("Error Selecting Item");
    });
  }
  var updateItem = function(taskId, description, checked) {
    var data = { description: description, done: checked };
    io.socket.put('/task/' + taskId, data, function(res, JWR) {
      if(JWR.statusCode >= 300) console.log("Error Selecting Item");
    });
  }
  var selectedItem = function(taskId, checked) {
    var data = { done: checked };
    io.socket.put('/task/' + taskId, data, function(res, JWR) {
      if(JWR.statusCode >= 300) console.log("Error Selecting Item");
    });
  }
  var getList = function(id) {
    var url = "/list";
    if(id) url += "/" + id;
    io.socket.get(url, function(res, JWR) {
      if(JWR.statusCode >= 300) window.location.replace("/");
      $("#todoHeader").html(res.name);
      res.task.forEach(function(task) {
        addToPage(task.id, task.description, task.done);
      });
    });
  }

  var editClick = function(event) {
    var id = $(this).parent().parent().attr('id').split('-')[1];
    console.log("Edit Click: " + id);
    $(".edit-list").show();
  }
  var deleteClick = function(event) {
    var id = $(this).parent().parent().attr('id').split('-')[1];
    console.log("Delete Click: " + id);
    deleteItem(id);
  }
  var checkboxChange = function(event) {
    var id = $(this).parent().attr('id').split('-')[1];
    if($(this).is(":checked")) {
      console.log("CHECKED: " + id);
      selectedItem(id, true);
    }
    else {
      console.log("UNCHECKED: " + id);
      selectedItem(id, false);
    }
  }

  getList(1);

}(jQuery));
