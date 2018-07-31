$(function () {
    $('#enter-system').on('click', function (event, acc, res) {
        event.preventDefault();
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
                console.log(firstAccount);
                $.post('/home/' + firstAccount).done(function (data) {

                    if (data.key === 3) {
                        var result = confirm(data.msg);
                        if (result) {
                            window.location.href = '/home/' + firstAccount + '/signuppatient';
                        } else {
                            window.location.href = '/home/' + firstAccount + '/signupdr';
                        }
                    } else if (data.key === 1) {
                        alert(data.msg);
                        user.getUserType(function (err, res) {
                            if (err) throw err;
                            else {
                                console.log("usertype",res.c[0]);
                                if(res.c[0]===1){
                                    window.location.href = '/patient/' + firstAccount;
                                }
                                else{
                                    alert("Sorry, you are not authorized to enter the system");
                                    window.location.href = '/';
                                }
                            }
                        });
                        
                    } else if (data.key === 2) {
                        alert(data.msg);
                        user.getUserType(function (err, res) {
                            if (err) throw err;
                            else {
                                console.log("usertype",res.c[0]);
                                if(res.c[0]===2){
                                    window.location.href = '/doctor/' + firstAccount;
                                }
                                else{
                                    alert("Sorry, you are not authorized to enter the system");
                                    window.location.href = '/';
                                }
                            }
                        });
                    } else {
                        alert(data.msg);
                        window.location.href = '/';
                    }
                });
            }

        }

    });
    // $('#wizard').smartWizard(function(){
    //     alert(selected);
    // });
});