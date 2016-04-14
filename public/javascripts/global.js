// using simple jQuery + Jade stack due the lack of time
var articleListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the article table on initial page load
    populateTable();

    // articleTitle link click
    $('#articleList table tbody').on('click', 'td a.linkshowarticle', showarticleInfo);

    // Add article button click
    $('#btnAddArticle').on('click', addArticle);

    // Delete article link click
    $('#articleList table tbody').on('click', 'td a.linkDelArticle', deleteArticle);
    
    // Update article link click
    $('#articleList table tbody').on('click', 'td a.updateArticleLink', updateArticle);
});

// Functions =============================================================

var onError = function( response ) {
    alert('Error: ' + JSON.parse(response.responseText).error);
};

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/api/articles/', function( data ) {

        // Stick our article data array into a articlelist variable in the global object
        articleListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowarticle" rel="' + this.title + '" title="Show Details">' + this.title + '</a></td>';
            tableContent += '<td>' + this.author + '</td>';
            tableContent += '<td><a href="#" class="linkDelArticle" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="updateArticleLink" rel="' + this._id + '">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#articleList table tbody').html(tableContent);
    });
};

// Show article Info
function showarticleInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve articleTitle from link rel attribute
    var thisarticleTitle = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = articleListData.map(function(item) { return item.title; }).indexOf(thisarticleTitle);

    // Get our article Object
    var currentArticleObject = articleListData[arrayPosition];

    //Populate Info Box
    $('#articleInfoTitle').text(currentArticleObject.title);
    $('#articleInfoAuthor').text(currentArticleObject.author);
    $('#articleInfoDescription').text(currentArticleObject.description);
    $('#articleInfoModified').text(currentArticleObject.modified);
};

// Add article
function addArticle(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addArticle input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all article info into one object
        var newarticle = {
            'title': $('#addArticle fieldset input#inputArticleTitle').val(),
            'author': $('#addArticle fieldset input#inputArticleAuthor').val(),
            'description': $('#addArticle fieldset input#inputArticleDescription').val()
        }

        // Use AJAX to post the object to our addArticle service
        $.ajax({
            type: 'POST',
            data: newarticle,
            url: '/api/articles',
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.status === 'OK') {
                // Clear the form inputs
                $('#addArticle fieldset input').val('');

                // Update the table
                populateTable();
            }
        }).error(onError);
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function updateArticle(event) {
    event.preventDefault();

    // If it is, compile all article info into one object
    var update = {
        'title': 'Hello, brave new world!',
        'author': 'John Doe',
        'description': 'It never was my best.'
    }

    // Use AJAX to post the object to our addArticle service
    $.ajax({
        type: 'PUT',
        data: update,
        url: '/api/articles/' + $(this).attr('rel'),
        dataType: 'JSON'
    }).done(function( response ) {
        if (response.status === 'OK') {
            // Clear the form inputs
            populateTable();
        }
    }).error(onError);
};

// Delete article
function deleteArticle(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this article?');

    // Check and make sure the article confirmed
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/api/articles/' + $(this).attr('rel')
        }).done(function( response ) {
            populateTable();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};