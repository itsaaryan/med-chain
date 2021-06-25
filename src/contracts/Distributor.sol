pragma solidity >=0.5.0 <0.8.6;

import "./Medicine.sol";

contract Distributor{
    address owner;
    enum packageStatus{atCreator,picked,delivered}

    address public batchId;
    address sender;
    address shipper;
    address retailer;
    packageStatus status;

    constructor(
        address _batchId,
        address _sender,
        address _shipper,
        address _retailer
    ) public {
        owner=_sender;
        batchId=_batchId;
        sender=_sender;
        shipper=_shipper;
        retailer=_retailer;
    }

    function getBatchIdStatus() public view returns(uint){
        return uint(status);
    }

    function pickPackageForRetailer(address _batchId,address _shipper) public {
        require(_shipper==shipper,"Only Shipper is allowed to pich package");
        status=packageStatus(1);
        Medicine(_batchId).pickPackageRetailer(_shipper);
    }

    function receivePackageRetailer(address _batchId,address _receiver) public {
        require(retailer==_receiver,"Only receiver is allowed to receive");
        status=packageStatus(2);
        Medicine(_batchId).receivePackageRetailer(retailer);
    }


    



}