// var myModule= require ('./web3');
// var web3= myModule.web3;
// console.log(typeof web3);
// $(document).ready(function(){
//     $(function(){
//         $('#enter-system').on('click', function(event){
//             event.preventDefault();

//             if (typeof web3 !== 'undefined'){
//                 alert('y');
//             } else {
//                 alert('n');
//             }

//         });
//     });

// });

if (typeof window.web3 !== "undefined" && typeof window.web3.currentProvider !== "undefined") {
    console.log('you have a provider');
    var web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('you dont have a provider');
    var modal = document.getElementById('install-metamask');
    modal.style.display = "block";
    $('#close-modal').on('click', function (event) {
        modal.style.display = "none";
    });
    $(document).getElementById('window').on('click', function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/F7F0FVQU2NvNwqRLrwHn'));
}
$(function () {
    $('#enter-system').on('click', function (event, acc, res) {
        event.preventDefault();

        if (typeof web3 !== 'undefined') {
            acc = web3.eth.accounts;
            if (acc.length === 0) {
                var modal = document.getElementById('login-first');
                modal.style.display = "block";
                $('#close-modal').on('click', function (event) {
                    modal.style.display = "none";
                });
                $(document).getElementById('window').on('click', function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                });

                // alert ('login first');
            } else {
                var firstAccount = acc[0];
                $.post('/home/' + firstAccount).done(function(data){
                    alert(data.msg);
                    if (data.key===3){
                        window.location.href = '/home/'+firstAccount+'/signup';
                    }
                    else if (data.key===1){
                        window.location.href = '/patient/'+firstAccount;
                    }
                    else if (data.key===2){
                        window.location.href = '/doctor/'+firstAccount;
                    }
                    else {
                        window.location.href = '/';
                    }
                });
            }

        } 

    });
});