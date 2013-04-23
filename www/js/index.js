$( document ).delegate("#user-page", "pageinit", function() {

  setInterval(function() {
    if(is_not_set("_now")){
      dates = JSON.parse(get("_dates"));

      $.each(dates, function(i, date) {

        if (new Date(date) - Date.now() < 0){
          actual = JSON.parse(get(date));
          if(actual != null){
            $("#now-description").text(actual.description);
            set("_now", date);
            set("_scheduled", true);
            $.mobile.changePage("#now");
            return false;
          }
        }
      });
    }
  }, 30000);

  if (is_set("_now")){
    now = JSON.parse(get(get("_now")));
    $("#now-description").text(now.description);
    $.mobile.changePage("#now");
  }

  if (is_not_set('_actual')){
    $("#idea").addClass("hide");
  }else{
    description = JSON.parse(get(get("_actual"))).description;
    $("#description").text(description);
  }
  if (is_not_set('_index')){
    set("_index", 1);
    set("_first", 1);
  }
  if (is_not_set("_dates")){
    set("_dates", "[]");
  }

  $( "#collect-form" ).submit(function( event ){
    description = $("#collect-description").val();
    index = get("_index");

    if (is_not_set("_actual")){
      set("_actual", 1);
      set("_last", 1);
      $("#idea").removeClass("hide");
      $("#description").text(description);
    }else{
      last = JSON.parse(get(get("_last")));
      set(get("_last"), idea(last.description, index));
      set("_last", index);
    }

    set(index, idea(description, get("_first")));
    index++;
    set("_index", index);
    $("#collect-description").val("");
    popup(":)");
    return false;
  });

  $( "#do" ).click(function( event ){
    actual = JSON.parse(get(get("_actual")));
    $("#now-description").text(actual.description);
    set("_now", get("_actual"));
    $.mobile.changePage("#now");
  });

  $( "#review" ).click(function( event ){
    actual = JSON.parse(get(get("_actual")));
    set("_previous", get("_actual"));
    set("_actual", actual.next);
    next = JSON.parse(get(actual.next));
    $("#description").text(next.description);
    return false;
  });

  $( "#delete" ).click(function( event ){
    actual = JSON.parse(get(get("_actual")));
    previous = JSON.parse(get(get("_previous")));
    set(get("_previous"), idea(previous.description, actual.next));
    if(get("_actual") == get("_last")){
      set("_last", get("_previous"));
    }
    if(get("_actual") == get("_first")){
      set("_first", actual.next);
    }
    remove(get("_actual"));
    set("_actual", actual.next);
    next = JSON.parse(get(actual.next));
    if(next != null){
      $("#description").text(next.description);
    }else{
      remove("_actual");
      set("_first", 1);
      remove("_last");
      remove("_previous");
      set("_index", 1);
      $("#description").text("");
      $("#idea").addClass("hide");
    }
  });
});

$( document ).delegate("#now", "pageinit", function() {

  $("#schedule").mobiscroll().datetime();

  $( "#schedule" ).change(function( event ){
    set($(this).val(), get(get("_now")));
    dates = JSON.parse(get("_dates"));
    dates.push($(this).val());
    set("_dates", JSON.stringify(dates));
    remove("_now");
    $("#now").dialog("close");
    $("#delete").click();
  });

  $( "#now-complete" ).click(function( event ){
    $("#now").dialog("close");
    if(is_set("_scheduled")){
      remove(get("_now"));
      remove("_scheduled");
      dates = JSON.parse(get("_dates"));
      dates.splice(dates.indexOf(get("_now")), 1);
      set("_dates", JSON.stringify(dates));
    }else{
      $("#delete").click();
    }
    remove("_now");
  });

  $( "#now-delete" ).click(function( event ){
    $("#now").dialog("close");
    if(is_set("_scheduled")){
      remove(get("_now"));
      remove("_scheduled");
      dates = JSON.parse(get("_dates"));
      dates.splice(dates.indexOf(get("_now")), 1);
      set("_dates", JSON.stringify(dates));
    }else{
      $("#delete").click();
    }
    remove("_now");
  });
});
