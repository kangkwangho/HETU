$('#postDataBtn').on('click',()=>{
    let podID = $('#postDataInput').val();
    let andPoint = $('#postDataInput2').val();
    console.log(andPoint)
    $.ajax({
        url: '/movePod',
        type: 'POST',
        dataType: 'application/json',
        data: { "podID": podID, "andPoint": andPoint },
        timeout: 5000,
        success: function(response){
            console.log(response);
        },
        error: function(xhr, status, error){
            console.log(error);
        }
    });
});