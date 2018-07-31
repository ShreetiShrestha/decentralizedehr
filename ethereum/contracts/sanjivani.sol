pragma solidity ^0.4.24;

contract User{
    address UAdd;
    mapping(address=>bool) isPatient;
    mapping(address=>bool) isHCP;
    mapping (address=>Record) setPerm;

    address[] deployedElections;
    address[] deployedRecordSlots;
    mapping(uint =>Record) recordIDtoRec;
    
    
    struct Record{
    
        string ipfsHash;
        uint recordid;
        address owner;
    }
    Record[] records;
    
    function addPatient(address x) public { 
        isPatient[x] = true;
    }

    function addHCP(address x)public{
        isHCP[x] = true;
    }

    function addRecord(uint recid, string ipfs) public{
        Record memory newRecord = Record({
            recordid:recid,
            ipfsHash:ipfs,
            owner:msg.sender
        });
        records.push(newRecord);
        recordIDtoRec[recid] = newRecord;
        setPerm[msg.sender] = recordIDtoRec[recid];
    }
    
    function getUserType(address x) public view returns (uint){
        if (isHCP[x]){
            return 2;
        }
        else if (isPatient[x]){
            return 1;
        }
    }
    
    function getDeployedElections () public view returns (address[]){
        return deployedElections;
    }
    function getRecordDetail(uint recordid)public view returns (address,uint,string){
        // address requestor=msg.sender;
        require(checkperm(msg.sender));
        return (recordIDtoRec[recordid].owner,recordIDtoRec[recordid].recordid,recordIDtoRec[recordid].ipfsHash);    
    }

    function setPermission(address to,uint recid) public  {
        require(msg.sender==recordIDtoRec[recid].owner);
        setPerm[to] = recordIDtoRec[recid];
    }

    function checkperm(address to) public view returns(bool) {
        if(setPerm[to].recordid==0){
            return false;
        }
        else{
            return true;
        }
    }

}

contract Record{
    address public owner;
    mapping (uint=>string) recIDtoHash;
    
    constructor() public {
        owner = msg.sender;
    }
 
    function addRecord(string x,uint RID) public {
        recIDtoHash[RID] = x;
    }
    
    function getHash(uint RID) public view returns (string x) {
        return recIDtoHash[RID];
    }

}
