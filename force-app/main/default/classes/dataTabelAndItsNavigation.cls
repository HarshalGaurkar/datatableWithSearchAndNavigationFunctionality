public with sharing class dataTabelAndItsNavigation {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(){
        return [SELECT Name, StageName, Amount, CloseDate, Description FROM Opportunity WHERE StageName = 'Closed Won' LIMIT 20];
    }
}