$("#scrape").on("click", function () {
    $.ajax({
        url: "/scrape",
        method: "GET"
    }).then(function (data) {
        console.log(data);
        location.reload();
    })
})

$(".save").on("click", function () {
    var newId = $(this).attr("data-id")
    $.ajax({
        url: "/api/articles/" + newId,
        method: "PUT"
    }).then(function (data) {
        console.log(data);
    })
})

$("#clear").on("click", function () {
    $(".row").empty();
    $.ajax({
        url: "/delete",
        method: "DELETE"
    }).then(function (data) {
        console.log(data);
    })
})

$(document).on("click", ".delete", function () {
    var newId = $(this).attr("data-id")
    console.log(newId);
    $.ajax({
        url: "/api/articles/delete/" + newId,
        method: "POST"
    }).then(function (data) {
        console.log(data);
        location.reload();
    })
})

$(".saveNote").on("click", function () {
    var dataId = $("#articleId").val();
    console.log(dataId);
    var noteData = {
        title: $("#modal-title").text(),
        body: $("#textarea1").val()
    }

    var noteText = $("#textarea1").val()
    var newNote = $("<ul>").append($("<li>").append(noteText));
    $(".addedNotes").append(newNote);

    $.ajax({
        url: "/articles/" + dataId,
        method: "POST",
        data: noteData
    })
})

$(".notes").on("click", function () {
    var title = $(this).attr("data-title");
    var dataId = $(this).attr("data-id");
    $("#modal-title").html(title);
    $("#articleId").html(dataId);
})

$(".deleteNote").on("click", function () {
    // var noteId 
    $.ajax({
        url: "/deleteNote",
        method: "DELETE"
    })
})

$(document).ready(function () {
    $('.modal').modal();
});

// // Grab the articles as a json
// $.getJSON("/articles", function (data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].description + data[i].image + data[i].link + "</p>");
//         console.log(data);
//     }
// });


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function () {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//         method: "GET",
//         url: "/articles/" + thisId
//     })
//         // With that done, add the note information to the page
//         .then(function (data) {
//             console.log(data);
//             // The title of the article
//             $("#notes").append("<h2>" + data.title + "</h2>");
//             // An input to enter a new title
//             $("#notes").append("<input id='titleinput' name='title' >");
//             // A textarea to add a new note body
//             $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//             // A button to submit a new note, with the id of the article saved to it
//             $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//             // If there's a note in the article
//             if (data.note) {
//                 // Place the title of the note in the title input
//                 $("#titleinput").val(data.note.title);
//                 // Place the body of the note in the body textarea
//                 $("#bodyinput").val(data.note.body);
//             }
//         });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function () {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//             // Value taken from title input
//             title: $("#titleinput").val(),
//             // Value taken from note textarea
//             body: $("#bodyinput").val()
//         }
//     })
//         // With that done
//         .then(function (data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#notes").empty();
//         });

//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });
