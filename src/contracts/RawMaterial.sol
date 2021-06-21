pragma solidity >=0.5.0 <0.8.6;

contract RawMaterial{
    address owner;
    enum packageStatus{atCreator,picked,delivered}

    event ShippmentUpdate(
        address indexed BatchId,
        address indexed Shipper,
        address indexed Manufacturer,
        uint TransporterTpye,
        uint Status
    );

    address productId;
    string description;
    string ownerName;
    string location;
    uint256 quantity;
    address shipper;
    address manufacturer;
    address supplier;
    packageStatus status;
    string packageReceiverDescription;

    constructor(
        address _supplier,
        string memory _description,
        string memory _ownerName,
        string memory _location,
        uint256 _quantity,
        address _shipper,
        address _manufacturer
    ) public{
        owner=_supplier;
        productId=address(this);
        description=_description;
        ownerName=_ownerName;
        location=_location;
        quantity=_quantity;
        shipper=_shipper;
        manufacturer=_manufacturer;
        supplier=_supplier;
        status=packageStatus(0);
    }

       function getSuppliedRawMatrials () public view returns(
        string memory,
        string memory,
        string memory,
        uint,
        address,
        address,
        address
    ) {
        return(
            description,
            ownerName,
            location,
            quantity,
            shipper,
            manufacturer,
            supplier
        );
    }

    function getRawMatrialsStatus() public view returns(uint) {
        return uint(status);
    }

    function pickPackage(address _shipper) public {
        require(_shipper==shipper,"Only the shipper is allowed to ship this package!");
        require(status==packageStatus(0),"the package is no longer with the owner!");
        status=packageStatus(1);
        emit ShippmentUpdate(address(this), shipper, manufacturer, 1, 1);
    }

    function receivePackage(address _manufacturer) public{
        require(_manufacturer==manufacturer,"Ony manufacturer can receiv the package");
        require(status==packageStatus(1),"Package not shipped yet!");
        status=packageStatus(2);
        emit ShippmentUpdate(address(this), shipper, manufacturer, 1, 2);
    }
}