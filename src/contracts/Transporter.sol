pragma solidity >=0.5.0 <0.8.6;

import "./Admin.sol";
import "./RawMaterial.sol";
import "./Medicine.sol";
import "./Distributor.sol";

contract Transporter{
        enum roles{
        norole,
        supplier,
        transporter,
        manufacturer,
        distributor,
        retailer,
        revoke
    }

    address admin;

    constructor(address _admin) public {
         admin=_admin;
    }

    function loadConsignment(
        address batchId,
        uint transporterType,
        address distributorId
    ) public {
        require(roles(Admin(admin).getRole(msg.sender))==roles.transporter,"Only transporter can call this function.");
        require(transporterType>0,"Transporter type undefined");
        if(transporterType==1){
            RawMaterial(batchId).pickPackage(msg.sender);
        }
        else if(transporterType==2){
            Medicine(batchId).pickPackageDistributor(msg.sender);
        }
        else if(transporterType==3){
            Distributor(distributorId).pickPackageForRetailer(batchId,msg.sender);
        }
    }
}