(function($) {
  var addToPage = function(id, name) {
    var htmlId = "list-" + id;
    var html = "<li id='" + htmlId + "' class='list-group-item'>";
    html += "<a href='#'>" + name + "</a>";
    html += "</li>";
    $(".list_of_tasks").append(html);
    $("#"+htmlId)
    .on("click", taskClick);
  }

  var getList = function() {
    var url = "/list";
    io.socket.get(url, function(res, JWR) {
      if(JWR.statusCode >= 300) $(".content").html("ERROR");
      res.forEach(function(item) {
        addToPage(item.id, item.name);
      });
    });
  }

  var taskClick = function(event) {
    var id = $(this).attr('id').split('-')[1];
    window.location.replace("/todo/" + id)
  }

  getList();

}(jQuery));
