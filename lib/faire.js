var internals = {};
internals.staticPage = function(request) {
	console.log("inside faire.internals.staticPage()");
	//needs to be initialized beforehand
	var sequelize = require('./db').getExistingConnection();
	if (!sequelize) { console.log("test");throw new Error("Connection wasn't established."); }
	
    var me = request;
    
    sequelize.query("SELECT * FROM tasks ORDER BY created DESC").success(function(myTableRows) {
        console.log(myTableRows);
        var result = "";
        var total = myTableRows.length;
        
        if(total) {
            myTableRows.forEach(function(element, index) {
                /*result.push({
                    id: element.id,
                    body: element.body,
                    created: element.created,
                    state: element.state
                });*/
                
                result += "<div class=\"task\">" + element.body + "</div>";
                if(index == total - 1) {
                    internals.templateStaticPage(me, result);  
                }    
            });
        } else {
            internals.templateStaticPage(me, {});
        }
    }).fail(function(err) { 
        console.log("error in faire.internals.staticPage: " + err); 
        internals.templateStaticPage(me, {});
    });
    
    //me.reply.view("staticpage.html", {greeting: 'hello world', title: 'test'}).send();
};
 
internals.templateStaticPage = function(request, tasks) { 
	request.reply.view("staticpage.html", {tasks: 'test', pageTitle: 'Email Asset creation', contentTitle: 'EMAIL ASSET CREATION CHECKLIST'});   
};


module.exports = function () {
	console.log("inside faire.js");
	internals.staticPage(this);
}