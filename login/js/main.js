const CodiCorrecteHash = "$2y$10$6fj0YCNzZQnQ3qyUJRsusuqAt6FJH.nNrF1R0xxTHnX62161z3yNC";

$(window).on("load",  async () => {

    $('#login').on("submit", async (event) => {
        event.preventDefault();
        try {
            
            var codi = $("#codi-acces");
            var bcrypt = dcodeIO.bcrypt;
            if (bcrypt.compareSync(codi.val(), CodiCorrecteHash)) {
                window.location.assign("graph.html");
            }
            else {
                alert("Codi incorrecte.");
                window.location.reload();
            }
        } catch (error) {
            console.log(err);
        }
    });
});