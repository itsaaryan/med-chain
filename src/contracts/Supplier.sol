pragma solidity >=0.5.0 <0.8.6;

import "./Admin.sol";
import "./RawMaterial.sol";

contract Supplier{

    address admin;

    constructor(address _admin) public {
        admin=_admin;
    }
      enum roles{
        norole,
        supplier,
        transporter,
        manufacturer,
        distributor,
        retailer,
        revoke
    }

    mapping(address=>address[]) supplierRawProductInfo;

    event RawSupplyInit(
        address indexed productId,
        address indexed supplier,
        address shipper,
        address indexed receiver
    );

    function createRawPackage(
        string memory _description,
        string memory _ownerName,
        string memory _location,
        uint256 _quantity,
        address _shipper,
        address _manufacturer
    ) public {

        require(roles(Admin(admin).getRole(msg.sender))==roles.supplier,"Only supplier can create a package!");

        RawMaterial rawData=new RawMaterial(
            msg.sender,
         _description,
         _ownerName,
         _location,
         _quantity,
         _shipper,
         _manufacturer
        );

        supplierRawProductInfo[msg.sender].push(address(rawData));
        emit RawSupplyInit(address(rawData), msg.sender, _shipper, _manufacturer);
    }

    function getPackageCountSupplier(address _supplier) public view returns(uint){
        require(roles(Admin(admin).getRole(_supplier))==roles.supplier,"Only supplier can get a package!");
        return supplierRawProductInfo[_supplier].length;
    }

    function getPackageIdByIndexSupplier(uint index,address _supplier) public view returns(address){
        require(roles(Admin(admin).getRole(_supplier))==roles.supplier,"Only supplier can call this function!");
        return supplierRawProductInfo[_supplier][index];
    }
}