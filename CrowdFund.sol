//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface DaiToken {
    function transfer(address dst, uint wad) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

contract CrowdFund {
    DaiToken dai;
    enum Status {
        OPEN,
        WORKING,
        SUCCESS,
        CLOSED,
        FAILED
    }

    uint totalCampaign;
    uint minContribution;
    uint minDeposit;
    //platform fee = 0.03%

    struct Withdrawal{
        string desc;
        uint value;
        bool approved;
        mapping(address=>bool) approvals;
        uint approvalCount;
        uint totalVote;
        bool claimed;
        uint deadline;
    }

    mapping(address=>uint) fundTotal;

    struct Campaign {
        uint id;
        uint minContribution;
        address payable creator;
        string data;
        uint totalRaised;
        uint balance;
        uint capAmount;
        Status status;
        uint withdrawCount;
        uint ContributorCount;
        uint deadlineInDays;
        //mapping(address=>uint) tokenHolderAmount;
        //mapping(uint=>Withdrawal) withdrawals;
    }

    Campaign[] allCampaigns; //allCampaigns (id=>Campaign)
    mapping(address=>Campaign) CampaignCreator; //address=>Campaign
    mapping(address=>mapping(uint=>uint)) contributedCampaign; //contributor_address=>count=>id
    mapping(address=>mapping(uint=>uint)) CampaignContributors; //address=>id=>token
    mapping(uint=>mapping(uint=>Withdrawal)) CampaignWithdrawal; //id=>withdrawalNo=>withdrawal

    constructor(){
        dai = DaiToken(0x6B175474E89094C44Da98b954EedeAC495271d0F);
        totalCampaign = 0;
        minContribution = 50 ether;
        minDeposit = 10 ether;
    }

    function createCampaign(string memory _data, uint _goalAmount,uint _minContribution, uint _days) payable external{
        
        Campaign memory campaign = Campaign({
            id:totalCampaign,
            creator:payable(msg.sender),
            data:_data,
            minContribution:_minContribution,
            totalRaised:0,
            ContributorCount :0,
            capAmount :_goalAmount,
            status : Status.OPEN,
            withdrawCount:0,
            balance:0,
            deadlineInDays: block.timestamp + _days * 1 days
            
        });
        CampaignCreator[msg.sender] = campaign;
        allCampaigns.push(campaign);
        totalCampaign+=1;
    dai.transferFrom(msg.sender, address(this), msg.value);
    }

    
    modifier checkCampaignID(uint _id){
        require(_id<=totalCampaign,"Invalid Campaign ID!");
        _;
    }
    
    modifier onlyCreator(uint _id){
        require(_id<=totalCampaign,"Invalid Campaign ID!");
        require(allCampaigns[_id].creator==msg.sender,"You're not the creator!");
        _;
    }
 
    function contribute(uint _amount,uint _id) payable external checkCampaignID(_id){

        Campaign memory campaign = allCampaigns[_id];
        
        require(msg.value>=campaign.minContribution,"Not enough value! ");
        require(campaign.status==Status.OPEN, "CrowdFund is closed!");
        CampaignContributors[msg.sender][_id] += _amount;
        campaign.ContributorCount+=1;
        fundTotal[msg.sender]+=_amount;
        dai.transferFrom(msg.sender, address(this), msg.value);

    }

    function createWithdrawal(uint _id,uint _amount,string memory _desc,uint _days) external onlyCreator(_id){
        
        Campaign memory campaign = allCampaigns[_id];
        require(_amount>=campaign.balance,"Not enough balance!");
        Withdrawal storage withdrawal = CampaignWithdrawal[_id][campaign.withdrawCount];
        withdrawal.desc = _desc;
        withdrawal.approvalCount = 0;
        withdrawal.value = _amount;
        withdrawal.approved = false;
        //set timestamp
        withdrawal.deadline = block.timestamp + _days * 1 days;
        campaign.withdrawCount+=1;

        
    }

    //onlyContributors can approve
    function approveWithdraw(uint _id,uint _withdrawalID,uint _vote) external checkCampaignID(_id){
        Campaign memory campaign = allCampaigns[_id];
        require(CampaignContributors[msg.sender][_id]>0,"Not funder!");
        require(campaign.withdrawCount==_withdrawalID,"Invalid withdrawID!");
        Withdrawal storage withdrawal = CampaignWithdrawal[_id][_withdrawalID]; 
        require(withdrawal.approvals[msg.sender], "You've already voted.");
        require(_vote==1||_vote==0, "Invalid vote!");
        withdrawal.totalVote+=1;
        //0 = no
        //1 = yes
        if (_vote==1){
            withdrawal.approvalCount+=1;
            
        }withdrawal.approvals[msg.sender]=false;
        
    }

    function claimWithdrawal(uint _id,uint _withdrawalID) external onlyCreator(_id) {
        Withdrawal storage withdrawal = CampaignWithdrawal[_id][_withdrawalID]; 
        Campaign memory campaign = allCampaigns[_id];
        require(withdrawal.value>=campaign.balance,"Not enough balance!");
        require(!withdrawal.claimed,"Withdrawal is claimed!");
        require((block.timestamp*1 days)>withdrawal.deadline,"Please wait till deadline");
        
        if (withdrawal.approvalCount>withdrawal.totalVote){
            campaign.balance-=withdrawal.value;
            withdrawal.claimed=true;
            dai.transfer(msg.sender, withdrawal.value);
        }
    }

    //All the getters
    function getAllCampaigns() external view returns(Campaign[] memory){
        return allCampaigns;
    }

    function getMyCampaigns() external view returns(Campaign memory){
        return CampaignCreator[msg.sender];
    }

    function getCampaign(uint _id) public view returns(Campaign memory){
        return allCampaigns[_id];
    }

    
}
