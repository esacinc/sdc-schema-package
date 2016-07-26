<?xml version="1.0" encoding="UTF-8"?>
<sch:schema
    queryBinding="xslt2"
    xmlns:sch="http://purl.oclc.org/dsdl/schematron"
    xmlns:sdc="http://healthIT.gov/sdc">
    
    <sch:title>Structured Data Capture (SDC) Schematron schema.</sch:title>
    
    <sch:ns prefix="sdc" uri="http://healthIT.gov/sdc"/>
    
    <sch:pattern>
        <sch:rule context="//sdc:*[not(empty(@instanceGUID)) and not(empty(@parentGUID))]">
            <sch:let name="nodeInstanceGuid" value="@instanceGUID"/>
            <sch:let name="nodeParentGuid" value="@parentGUID"/>
            <sch:assert test="count(//sdc:*[@instanceGUID = $nodeParentGuid]) = 1">RepeatingType instance (guid=<sch:value-of select="$nodeInstanceGuid"/>) parent (guid=<sch:value-of select="$nodeParentGuid"/>) does not exist.</sch:assert>
        </sch:rule>
    </sch:pattern>
</sch:schema>