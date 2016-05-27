var xmlDoc;

$(document).ready(function () {

    jQuery.support.cors = true;
    
    //save original xml in jquery variable  
    var xmlstring = $("#rawxml").val();   //server puts original xml in #rawxml
    xmlDoc = $.parseXML(xmlstring);
    $xml = $(xmlDoc);

});


function sayHello(name) {
    alert("sayHello function in javascripts says - hello, " + name);
    return window.external.ShowMessage("If you can see this message sayHello successfully called ShowMessage function in this desktop client app.");

}

var repeat = 1;


//adds a new repeat of a section
function addSection(obj) {
    //obj is btnAdd

    //we need to clone table, so get table
    var td = obj.parentElement;
    var table = td.parentElement  //tr
                   .parentElement  //tbody
                   .parentElement //table

    /*id of the div and table element = 's' + instanceGuid of the section node*/
    var sectionGUID = table.parentElement.id;  //table's parent is div

    var max = table.parentElement.firstChild.value;  //maxcardinality is the first child of div
    
    var textboxes = td.getElementsByTagName("input");  //get hidden input, radio buttons, checkboxes and input text boxes
   
    var newtable = table.cloneNode(true);    

    /*table id is the same as sectionGuid and we are keeping table id the same for new table
      so that we can get to a particular instance of table repeat by its id.*/
    newtable.id = table.id;    

    repeat = +repeat + 1;      //repeat is a global variable


    /*Make the remove button visible in the new section, 
    and hide the add button on the previous repeat.
    The Add button should be only visible in the last repeat*/

    obj.nextSibling.style.visibility = "visible"; //remove button is made visible
    obj.style.visibility = "hidden";    //add button is hidden

    var trace = 0;
    var newname;
    var i;
    var parentGUID;
    var ID;


    try {

        //add the new repeat in the form - note that we will keep the id of the new table the same as old, so that
        //we can easily get to a particular repeat of the table if needed

        table.parentElement.appendChild(newtable);

        var saveParentGUID="";
		
        $section = $xml.find('Section[instanceGUID="' + table.id.substring(1) + '"]');
	
		if($section==null)
		{
			alert("Error: section not found.");
			return;
		}
		
       	sectionid = $section.attr("ID")
        

        $newsec = $section.clone(true);
        $parentGUID = generateGuid();
        $newsec.attr("instanceGUID", $parentGUID);
        populateGuids($newsec);
        //test  
        $newsec.find('Question').each(function(){
			//alert($(this).attr("instanceGUID"));
		}
		)

        //4/17/2016: find the last repeat section node with the section id, 
        //then add the new repeat section node as the following sibling of that section               
	$collection = $section.parent().find('Section[ID="' + sectionid + '"]');
        if($section==null)
        {
           alert("section with ID = " + sectionid + " not found");
           return;
        }

        $section=$collection[$collection.length-1];
        $newsec.insertAfter($section);

	//$section.parent().append($newsec);
       
        //iterate through textboxes inside the table and assign new unique ids to them
        for (i = 0; i < textboxes.length; i++) {

            if (textboxes[i].type == "hidden" || textboxes[i].type == "text" || textboxes[i].type=="radio") {

                if(textboxes[i].id=="maxcardinality")  //the td element may contain div with maxcardinality if a section is nested
                      continue;

                if(textboxes[i].name=="")  //should not happen
                {
                    alert("error: a " + textboxes[i].type + " box without name is found at " + i);
                    continue;
                }
 
                ID = textboxes[i].name.split(":")[2];

                if (textboxes[i].type == "hidden") {
                    $question = $newsec.find('Question[ID="' + ID + '"]'); 
					if($question==null)
					{
						alert("Error: no question with ID = " + ID + "found.");
						return;
					}
					
                    $questionGUID = $question.attr('instanceGUID');
                    $parentGUID = $question.attr('parentGUID');
					newname = $questionGUID + ":" + $parentGUID + ":" + ID;
					//alert(newname);
                }

            
                //find the element in the new table
                var item = findElementByName(newtable, textboxes[i].name)
                                
                if(item==null)
                {
                    alert("error: input element with name: " + textboxes[i].name + " not found.");
                    return;
                }

               
                if(item.type=="hidden")   //question will have Q as the first letter
                    item.name = 'q' + newname;
                else 
                {   
               	    item.name = newname;
                    if(item.type=="radio" || item.type == "checkbox")
                        item.checked = false;
                    else
                        item.value = "";
                 }

            }  //end of if 

        }    //end of for loop
        //}




        //hide the Add button if max count reached

        inputs = newtable.getElementsByTagName('*');
        for(m=0;m<inputs.length;m++)
        {
			if(inputs[m].id=="btnAdd")
           {
              if (countRepeats(sectionGUID) == max)
                  inputs[m].style.visibility="hidden";
              else
                  inputs[m].style.visibility="visible";
           }
           if(inputs[m].id=="btnRemove")
              inputs[m].style.visibility="visible";
        }

        
        //show remove button on all sections except when 


    }
    catch (err) {
        alert(err.message + "\n" + trace + "\n" + newname + "n" + i);
    }

}


function populateGuids(section)
{
   //alert(test);
  if(section==null)
  {
	  alert("section is null");
	  return;
  }
  
  section.children("ChildItems").children("Question").each(function(){
      $(this).attr("parentGUID",section.attr("instanceGUID"));
      $(this).attr("instanceGUID", generateGuid());
	  
  });
  
  
  section.children("ChildItems").children("Section").each(function(){
	 $(this).attr("parentGUID",section.attr("instanceGUID"));
     $(this).attr("instanceGUID",generateGuid());	
     	 
     populateGuids($(this));
  });

}


function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}


function countRepeats(sectionid) {

    var section = document.getElementById(sectionid);  //
    var tables = section.getElementsByTagName('TABLE');
    var count = 0;
    for(i=0; i<tables.length; i++)
    {
       if(tables[i].id == sectionid) count++;
    }
   
    return count;

}

function getLastRepeat(sectionid) {
    var section = document.getElementById(sectionid);
    var tables = section.parentElement.getElementsByTagName('TABLE');
    var ret = null;
    for(i=0;i<tables.length;i++)
    {
       if(tables[i].id==sectionid)
         ret = tables[i];
    }
    return ret;

}

function removeSection(obj) {
    td = obj.parentElement;
    tr = td.parentElement;
    tbody = tr.parentElement;
    table = tbody.parentElement;
    var section = table.parentElement;
    section.removeChild(table);
    
    //make Add button on the last repeat visible again
    last = getLastRepeat(section.id);
    inputs = last.getElementsByTagName('*');
    for(m=0;m<inputs.length;m++)
    {
	if(inputs[m].id=="btnAdd")
        {
             inputs[m].style.visibility="visible";
        }
    }
    
    
    instanceGUID = section.id;
    //repeat = table.id;
    $xml.find('Section[ID="' + instanceGUID + '"]').eq(table.id).remove(); 
}


/*
Helper functions
*/
function trim(input) {
input = input.replace(/^\s+|\s+$/g, '');
return input;
}

function findElementById(parentId, Id) {
   //finds an element among descedants of a given node
   var parent = document.getElementById(parentId);

   var children = parent.getElementsByTagName('*');


   for (i = 0; i < children.length; i++) {

      if (children[i].id == Id) {
         return children[i];
      }
   }

}

function findElementByName(parentElement, Name) {
  //finds an element among descedants of a given node
  var children = parentElement.getElementsByTagName('*');
  for (i = 0; i < children.length; i++) {
     if (children[i].name == Name) {
         return children[i];
     }
  }
}

function xmlToString(xmlData) {

    var xmlString;
    //no longer needed for newer IE
    //IE
    if (window.ActiveXObject) {
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else {
    xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}

//helper functions end

//submit form calls this function
/*
Builds flatXml, updates the original xml with answers.
Note that new section nodes for repeat sections have already been added (upon clicking btnAdd - addSection function) 
*/
var flatXml;
function openMessageData() {

    var sb = "";
    var q, answer = "";
    var elem = document.getElementById("checklist").elements;
    var response = "<response>";
    var html = response;

    for (var i = 0; i < elem.length; i++) {
        q = "";
        var name = elem[i].name;

        var value;

        //split up name into instanceGuid and parentGuid and question id
        var components = name.split(':');
        var instanceGUID = components[0].substring(1);
        var parentGUID = components[1];
        var id = components[2];

        if (name.indexOf("q") == 0) {
            value = elem[i].value;

            answer = GetAnswer(name.substring(1));

            if (answer != "") {

                response += "<question ID=\"" + id + "\" display-name=\"" + value.replace(/</g, "&lt;").replace(/>/g, "&gt;") 
                         + "\" instanceGUID=\"" + instanceGUID + "\" parentGUID = \"" + parentGUID + "\">";
                response += answer + "</question>";

                

                 q += "<div class=\"MessageDataQuestion\">&lt;question ID=\"" + id + "\" display-name=\"" + value + "\" instanceGUID=\"" + instanceGUID + "\" parentGUID = \"" + parentGUID + "\"";
                 q += "&gt;<br><div class=\"MessageDataAnswer\">" + answer.replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</div>&lt;/question&gt;</div>";
		         q = q.replace(/&lt;br&gt;/g,"<br>");
			    


            }
            sb += q;
            answer = "";
        }
    }

    response = response.replace(/<br>/g, "");
    response = response + "</response>";

    flatXml = response;


    sb = "<div style='font-weight:bold; color:purple'>Flat Xml response</div>" 
         + "<div class=\"MessageDataChecklist\">&lt;response&gt;" + sb + "&lt;/response&gt;</div>"
         + "<br/><div style='font-weight:bold; color:purple'>To save full xml response to the disk click on the Save icon on the tool bar.</div>"

    
    document.getElementById('MessageDataResult').innerHTML = sb;
    document.getElementById('MessageData').style.display = 'block';
    document.getElementById('FormData').style.display = 'none';
    
    //update Xml with answers
    updateXml();
    

    var test = xmlToString(xmlDoc);
    document.getElementById('rawxml').innerText = test;
    
}

function closeMessageData() {
    document.getElementById('MessageData').style.display = 'none';
    document.getElementById('FormData').style.display = 'block';
}

function GetAnswer(qCkey) {
    var elem = document.getElementById("checklist").elements;
    var str = "";
    var name, value;

    for (var i = 0; i < elem.length; i++) {
        name = elem[i].name;
        value = elem[i].value;

        if (name.indexOf(qCkey) == 0) {

            if (elem[i].checked || (elem[i].type == "text" && value != "")) {

                {

                    var k = value.split(',');

                    if (elem[i].type == "text" && value != "") {
                        //str += "&lt;answer value=\"" + value + "\"/&gt;<br>";
                        str += "<answer value=\"" + value + "\"/><br>";
                    }
                    else if (elem[i].type != "text") {
                        //str += "&lt;answer ID=\"" + k[0] + "\" display-name=\"" + GetDisplayName(value) + "\"/&gt;<br>";
                        str += "<answer ID=\"" + k[0] + "\" display-name=\"" + GetDisplayName(value) + "\"/><br>";
                    }
                }
            }
        }
    }
    return str;
}

function GetDisplayName(value) {
    var strArray = value.split(',');
    var returnStr = "";
    if (strArray.length > 1) {
        for (var i = 1; i < strArray.length; i++) {
            if (i != strArray.length) {
                returnStr += strArray[i] + ",";
            }
            else {
                returnStr += strArray[i];
            }
        }
    }
    returnStr = returnStr.replace(/</g,"&lt;").replace(/>/g,"&gt;");
    return returnStr.substr(0, returnStr.length - 1);
}


//updates answers in full xml
function updateXml() {
    var $xml = $(xmlDoc);  //full xml
    FlatDoc = $.parseXML(flatXml);
    $xmlFlatDoc = $(FlatDoc);
    $xmlFlatDoc.find('question').each(function () {
        var $question = $(this);
        var guid = $question.attr("instanceGUID");
        var parentGUID = $question.attr("parentGUID");
        var repeat = 0;
        

        //there may be multiple answers per question
        $question.find('answer').each(function () {
            var $test = $(this);
            var id = $test.attr("ID");
            var val = $test.attr("value");
            

            var $targetQuestion = $(xmlDoc).find("Question[instanceGUID='" + guid + "']");
            var targetQuestionId = $targetQuestion.attr("ID");


            if (id != null) {
                var $targetAnswer = $targetQuestion.find("ListItem[ID='" + id + "']");
                $targetAnswer.attr("selected", "true");
                
                if ($targetAnswer.find("ListItemResponseField") != null) {
			
                    val = $test.next().attr("value");

                    $response = $targetAnswer.find("Response").children(0);
                    $response.attr("val", val);
                }

            }
            else {
				
                $targetAnswer = $targetQuestion.find("ResponseField").find("Response");
                $targetAnswer.children(0).attr("val", val);
            }
        });
       
    });
    
   //remove    not selected ListItem
   //$xml.find('ListItem[selected!="true"]').remove();
   //remove where response is empty
   //$xml.find('Response').each(function(){
	   //alert(($this).childrennext().attr("val"));
   //	   if($(this).children(0).attr("val")==null || $(this).children(0).attr("val")=='')
	       $(this).parent().children().remove();
   //}); 
    //remove OtherText  
    //	$xml.find('OtherText').remove();
    //remove TextAfter
    //$xml.find("TextAfter").remove();	

}

function CallTestService(data) {
    var webServiceURL = "http://localhost:5000/Service1.asmx";
    webServiceURL = prompt("Enter endpoint:", webServiceURL);
    
    $.support.cors = true;
    var xmldata = encodeURIComponent(data);
    
    var soapRequest =
					'<?xml version="1.0" encoding="utf-8"?>' +
						' <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
								' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
								' xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
							' <soap:Body>' +
    								//' <Add xmlns="urn:ihe:iti:rfd:2007">' +
									//' <i>4</i>' +
									//' <j>5</j>' +
								    //' </Add>' +
                                    //' </test>' +
                                    ' <SubmitFormRequest xmlns="urn:ihe:iti:rfd:2007">' +
                                    ' <body>' + xmldata + '</body> ' +
                                    ' </SubmitFormRequest>' +
							' </soap:Body>' +
						' </soap:Envelope>';

    
    soapAction = "urn:SubmitForm";
    //soapAction = "urn:ihe:iti:rfd:2007/Add";

    $.ajax({
        type: "POST",
        url: webServiceURL,
        contentType: "text/xml",
        dataType: "xml",
        processData: false,
        headers: {
            "SOAPAction": soapAction
        },
        data: soapRequest,
        success: OnSuccess,
        error: OnError
    });

    return false;
}


function OnSuccess(data, status) {

    var xmlstring = xmlToString(data);
    if (document.getElementById("outxml") != null) {
        alert(xmlstring);
        document.getElementById("outxml").textContent = xmlstring;
        $("#outxml").css("background-color", "yellow");
    }
    
    
}

function OnError(xhr, textStatus, err) {
    alert('Status:' + xhr.status + ', Text:' + textStatus + ', Error: ' + err);
}

