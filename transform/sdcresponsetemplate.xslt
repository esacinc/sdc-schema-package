<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0" xmlns:sr="http://www.cap.org/pert/2009/01/"
	xmlns:x="http://healthIT.gov/sdc">
	
  <xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
	
  	<xsl:variable name="debug" select="'false'"/>
	
	<xsl:template match="/">
		
		<xsl:variable name ="required" select="string(//Header/OtherText[@type='web_posting_date meta']/@val)"/>
        <html>
            <head>
            <style>
            	Body 
				{
				    font-family: Arial;
				    font-size: 12px;
				    width: 100%;
				    margin-left: auto;
				    margin-right: auto;
				}
            	.BodyGroup
				{
				    width: 900px;
				    margin-left: auto;
				    margin-right: auto;
				    text-align: left;
				}
            	.HeaderGroup
				{
				    width: 99%;
				    margin-top: 5px;
				    margin-bottom: 5px;
				    margin-left: auto;
				    margin-right: auto;
				    #border: solid 1px #000080;
				    border: none;
				    padding: 2px;
				    clear: both;
				}
				.TopHeader
				{
				    text-align: left;
				    font-size: 14px;
				    font-weight: bold;
				    #background-color: #000080;
				    #color: #FFFFFF;
				    background-color: #FFFFFF;
				    color: #000080;
				    #padding: 2px;
				}

				
				#S1
				{
				    font-size: 18px;
				    font-weight: bold;
				    #background-color: #FFFFFF;
				    #color: #000080;
				    background-color: #FFFFFF;
				    color: #000080;
				    padding: 8px;
				    vertical-align: bottom;
				}

				.subSection
				{
				    text-align: left;
				    font-size: 14px;
				    font-weight: bold;
				    #background-color: #000080;
				    #color: #FFFFFF;
				    background-color: #FFFFFF;
				    color: #000080;
				    #padding: 2px;
				}

				.thinBox
				{
				    text-align: left;
				    font-size: 14px;
				    font-weight: bold;
				    font-style:italic;
				    #background-color: #000080;
				    #color: #FFFFFF;
				    background-color: #FFFFFF;
				    color: #000080;
				    #padding: 2px;
				}

            	.QuestionInListItem
				{
				    padding: 2px;
				    padding-left: 20px;
				}
            </style>
			 <!--<link rel="stylesheet" href="sdctemplate.css" type="text/css" />-->
            </head>
            <body align="left">
				<div class="BodyGroup">
					<div id="FormData">
						<form id="checklist" name="checklist" method="post" >
							
							<!--show header-->
							<xsl:variable name="title_style" select="//x:Header/@styleClass"/>
							<xsl:variable name='title_id' select="//x:Header/@ID"/>
							<div ID = '{$title_id}' class="{$title_style}">
								<xsl:value-of select="//x:Header/@title"/>
							</div>
							<!--show body-->
							<xsl:apply-templates select="//x:Body/x:ChildItems/x:Section" >
								<xsl:with-param name="required" select="$required" />
								 
							</xsl:apply-templates>
							<xsl:apply-templates select="//x:Body/x:ChildItems/x:Question" mode="level2" >
								<xsl:with-param name="required" select="$required" />
							</xsl:apply-templates>
						</form>
					</div>
				</div>
            </body>
        </html>
    </xsl:template>
   
    <xsl:template match="//x:Header">
       
       
    </xsl:template>
	
	<xsl:template match="x:Section">
		<xsl:param name="parentId"/>
		
		<xsl:if test="not (@visible) or (@visible='true')">
			<xsl:variable name="required" select="true"/>
			<xsl:variable name="style" select="@styleClass"/>
			<xsl:variable name="defaultStyle" select="'TopHeader'"/>
			<xsl:if test="(count(.//x:ListItem[@selected='true'])&gt;0) or (count(.//x:Response/*[@val!=''])&gt;0)">
			<div> 
				<table class="HeaderGroup" align="center">
				  
					<tr>
						<td>
							<xsl:choose>
								<xsl:when test="$style!=''">
									<div class="{$style}">
										<xsl:value-of select="@title"/>
									</div>
								</xsl:when>
								<xsl:otherwise>
									<div class="{$defaultStyle}">
										<xsl:value-of select="@title"/>
									</div>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:choose>
								<xsl:when test="$required='false'">

								</xsl:when>
								<xsl:otherwise>	
									<xsl:apply-templates select="x:ChildItems/x:Question" mode="level1" >
										<xsl:with-param name="required" select="'true'"/>
									</xsl:apply-templates>

									<xsl:apply-templates select="x:ChildItems/x:Section" >
										<xsl:with-param name="required" select="'true'"/>
									</xsl:apply-templates>

								</xsl:otherwise>
							</xsl:choose>
							<div style="clear:both"/>
						</td>
					</tr>
				</table>
			</div>
		</xsl:if>
		</xsl:if>
	</xsl:template>
	
	<!--question in section-->
	<xsl:template match="x:Question" mode="level1">
	   <div>
		<xsl:if test="x:ResponseField">
			<xsl:variable name="textvalue" select="x:ResponseField/x:Response//@val"/>
			<xsl:if test="$textvalue!=''">
					<div style="margin-right:10px;margin-top:7px">
						<b><xsl:value-of select="@title"/></b>:
						<u><i><xsl:value-of select="x:ResponseField/x:Response//@val"/></i></u>
					</div>
				    
			</xsl:if>
		</xsl:if>
		
		<xsl:if test="x:ListField">
			<xsl:if test="count(x:ListField/x:List/x:ListItem[@selected='true'])&gt;0">
			    <xsl:variable name = "title" select ="@title"/>
				<xsl:if test="$title!=''">
					<div style="float:left;margin-right:10px;margin-top:7px;font-weight:bold">
						<xsl:value-of select="@title"/>:
					</div>
				</xsl:if>
			    <div style="float:left;margin-top:7px;width:400px;">
					<xsl:apply-templates select="x:ListField" mode="level1"/>
				</div>
				<div style="clear:both"/>
			</xsl:if>
		</xsl:if>
	   </div>
		
	</xsl:template>
	
	<!--question in list item-->
<xsl:template match="x:Question" mode="level2">
	<div class="QuestionInListItem"> 
	    <xsl:if test="x:ResponseField/x:Response">
			<xsl:if test="x:ResponseField/x:Response//@val!=''">
				<b><xsl:value-of select="@title"/></b>: 
				<u><i><xsl:value-of select="x:ResponseField/x:Response//@val"/></i></u>
			</xsl:if>
		</xsl:if>
		<div style="clear:both;"/>
		<xsl:if test="x:ListField">
		    <xsl:variable name = "title" select ="@title"/>
				<xsl:if test="count(x:ListField/x:List/x:ListItem[@selected='true'])&gt;0">
				    <div style="float:left;width:400px;">
						<xsl:if test="$title != ''">
							<div style="float:left;margin-right:10px;font-weight:bold">
								<xsl:value-of select="$title"/>:
							</div>
						</xsl:if>
				    	<div style="float:left;">
							<xsl:apply-templates select="x:ListField" mode="level1"/>
				    	</div>
					</div>
				</xsl:if>
			<div style="clear:both"/>
		</xsl:if>
	</div>
</xsl:template>


<xsl:template match="x:ListField" mode="level1">
	
	<xsl:for-each select="x:List/x:ListItem">
		<div >  <!-- class="Answer">-->
		    <xsl:if test="@selected='true'">
				<xsl:value-of select="@title"/>
			</xsl:if>
			<!--answer fillin-->
			<xsl:if test="x:ListItemResponseField">
				
				<xsl:if test="x:ListItemResponseField/x:Response//@val!=''">
					:
					 <u><i><xsl:value-of select="x:ListItemResponseField/x:Response//@val"/></i></u>
				</xsl:if>
			</xsl:if>
		</div>
		<!--question within list-->
		<xsl:apply-templates select="x:ChildItems/x:Question" mode="level2"/>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>