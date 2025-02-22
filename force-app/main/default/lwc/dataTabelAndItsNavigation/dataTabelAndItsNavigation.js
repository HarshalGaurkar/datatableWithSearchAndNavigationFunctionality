import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/dataTabelAndItsNavigation.getOpportunities';
import { NavigationMixin } from 'lightning/navigation';

const OPPORTUNITY_COLS = [
    {
        label: "Name",
        type: "button",
        typeAttributes: { label: { fieldName: "Name" }, name: "gotoOpportunity", variant: "base" }
    },
    {
        label: "Stage",
        fieldName: "StageName"
    },
    {
        label: "Amount",
        fieldName: "Amount",
        type: "currency"
    },
    { label: "Close Date", type: "date", fieldName: "CloseDate" },
    { label: "Description", fieldName: "Description" },
    {
        label: "Edit",
        type: "button",
        typeAttributes: {
            label: "Edit",
            name: "editOpportunity",
            variant: "brand"
        }
    }
];

export default class DataTabelAndItsNavigation extends NavigationMixin(LightningElement) {
    @track opportunityCols = OPPORTUNITY_COLS;
    @track opportunities = [];
    @track filteredOpportunities = [];

    @wire(getOpportunities)
    wiredOpportunities({ error, data }) {
        if (data) {
            this.opportunities = data;
            this.filteredOpportunities = [...data];
        } else if (error) {
            console.error('Error fetching opportunities:', error);
        }
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        if (searchKey) {
            this.filteredOpportunities = this.opportunities.filter(opp =>
                opp.Name.toLowerCase().includes(searchKey)
            );
        } else {
            this.filteredOpportunities = [...this.opportunities];
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const recordId = event.detail.row.Id;

        if (actionName === "gotoOpportunity") {
            this[NavigationMixin.GenerateUrl]({
                type: "standard__recordPage",
                attributes: {
                    recordId: recordId,
                    actionName: "view"
                }
            }).then(url => {
                window.open(url, "_blank");
            });
        } else if (actionName === "editOpportunity") {
            this[NavigationMixin.Navigate]({
                type: "standard__recordPage",
                attributes: {
                    recordId: recordId,
                    actionName: "edit"
                }
            });
        }
    }
}