pragma solidity >=0.5.0 <0.8.6;



contract Medicine{
address public owner;

enum medicinestatus{
    atmanufacturer,
    picked_for_distributor,
    delivered_to_distributor,
    picked_for_retailer,
    delivered_to_retailer
}

string public description;
address public rawmaterial;
uint public quantity;
address public shipper;
address public manufacturer;
address public distributor;
address public retailer;
medicinestatus status;

event ShippmentUpdate(
    address indexed BatchId,
    address indexed Shipper,
    address indexed Receiver,
    uint TransporterType,
    uint Status
);

constructor(
    string memory _description,
    address _rawmaterial,
    uint _quantity,
    address _shipper,
    address _distributor
) public {
    owner=msg.sender;
    description=_description;
    rawmaterial=_rawmaterial;
    quantity=_quantity;
    shipper=_shipper;
    distributor=_distributor;
}

function getMediceInfo() public view returns(address,string memory,address,uint ,address ,address ){
    return (
         manufacturer,
        description,
        rawmaterial,
        quantity,
        shipper,
        distributor
    );
}

function getMedicineStatus() public view returns(uint){
    return uint(status);
}

function pickPackageDistributor() public {
    require(msg.sender==shipper,"The package can only be picked by the shipper!");
    require(status==medicinestatus(0),"the package left the manufacturer");
    status=medicinestatus(1);
    emit ShippmentUpdate(address(this), shipper, distributor, 1, 1);
}

function receivePackageDistributor() public {
    require(msg.sender==distributor,"only distributor can receive the package");
    require(status==medicinestatus(1),"the package is not with shiper");
    status=medicinestatus(2);
     emit ShippmentUpdate(address(this), shipper, retailer, 1, 2);
}

function pickPackageRetailer() public {
    require(msg.sender==shipper,"The package can only be picked by the shipper!");
    require(status==medicinestatus(2),"the package left the distributor");
    status=medicinestatus(3);
    emit ShippmentUpdate(address(this), shipper, retailer, 1, 3);
}

function receivePackageRetailer() public {
    require(msg.sender==retailer,"only distributor can receive the package");
    require(status==medicinestatus(3),"the package left the shipper");
    status=medicinestatus(4);
     emit ShippmentUpdate(address(this), shipper, retailer, 1, 4);
}

}