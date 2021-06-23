pragma solidity >=0.5.0 <0.8.6;

import './Admin.sol';
import './Medicine.sol';
import './Distributor.sol';
import './RawMaterial.sol';


contract MedCycle{

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

    /*****************************************************Manufacturer Section**************************************************/

    mapping(address=>address[]) RawPackagesAtManufacturer;
    mapping(address=>string) Hash;
    mapping(address=>address[]) ManufacturedMedicine;

     event MedicineNewBatch(
        address indexed BatchId,
        address indexed Manufacturer,
        address shipper,
        address indexed Receiver
    );

    function rawPackageReceived(address rawmaterialAddress) public {
        require(roles(Admin(admin).getRole(msg.sender))==roles.manufacturer,"Ony manufacturer can receive the packages");
        RawMaterial(rawmaterialAddress).receivePackage(msg.sender);
        RawPackagesAtManufacturer[msg.sender].push(rawmaterialAddress);
    }

    function getPackagesCountManufacturer(address _manufacturer) public view returns(uint){
        require(roles(Admin(admin).getRole(_manufacturer))==roles.manufacturer,"Only Manufacturer is allowed to call this");
        return RawPackagesAtManufacturer[_manufacturer].length;
    }

    function getPackageIdByIndexManufacturer(uint index,address _manufacturer) public view returns(address){
        require(roles(Admin(admin).getRole(_manufacturer))==roles.manufacturer,"Only Manufacturer is allowed to call this");
        return RawPackagesAtManufacturer[_manufacturer][index];
    } 

    function manufactureMedicine(
        string memory _description,
        address _rawmaterial,
        uint _quantity,
        address _shipper,
        address _distributor
        ) public {
        require(roles(Admin(admin).getRole(msg.sender))==roles.manufacturer,"Only Manufacturer is allowed to call this");
           Medicine newMedicine=new Medicine(
                msg.sender,
                 _description,
                _rawmaterial,
                _quantity,
                _shipper,
                 _distributor
           ); 
           ManufacturedMedicine[msg.sender].push(address(newMedicine));
           emit MedicineNewBatch(address(newMedicine), msg.sender, _shipper, _distributor);
        }

    function getManufacturedMedicineCountManufacturer(address _manufacturer) public view returns(uint){
            require(roles(Admin(admin).getRole(_manufacturer))==roles.manufacturer,"Only Manufacturer is allowed to call this");
            return ManufacturedMedicine[_manufacturer].length;
    }

    function getManufacturedMedicineIdByIndexManufacturer(uint index,address _manufacturer) public view returns(address){
            require(roles(Admin(admin).getRole(_manufacturer))==roles.manufacturer,"Only Manufacturer is allowed to call this");
            return ManufacturedMedicine[_manufacturer][index];
    }

    function setHash(string memory _hash) public {
            Hash[msg.sender]=_hash;
    }

    function getHash() public view returns(string memory){
            return Hash[msg.sender];
    }

    /***********************************************************Distributor Section********************************************************/

    mapping(address => address[]) MedicineDistributorToRtailer;
    mapping(address => address) MedicineDistributorToRtailerxContract;

    function transferMedicineDistributorToRetailer(
        address _batchId,
        address _shipper,
        address _retailer
    ) public {
            require(roles(Admin(admin).getRole(msg.sender))==roles.distributor &&
             msg.sender == Medicine(_batchId).distributor(),
            "Only Distributor is allowed to call this"
            );

            Distributor newPackage=new Distributor(
                _batchId,
                msg.sender,
                _shipper,
                _retailer
            );

            MedicineDistributorToRtailer[msg.sender].push(address(newPackage));
            MedicineDistributorToRtailerxContract[_batchId]=address(newPackage);
    }

    function getBatchesCountDistributorToRetailer(address _distributor) public view returns(uint){
         require(roles(Admin(admin).getRole(_distributor))==roles.distributor,
            "Only Distributor is allowed to call this"
            );
        return MedicineDistributorToRtailer[_distributor].length;
    }

     function getBatchesIdByIndexDistributorToRetailer(uint index,address _distributor) public view returns(address){
          require(roles(Admin(admin).getRole(_distributor))==roles.distributor,
            "Only Distributor is allowed to call this"
            );
        return MedicineDistributorToRtailer[_distributor][index];
     }

     function getSubContractDistributorToRetailer(address _batchId) public view returns(address){
         return MedicineDistributorToRtailerxContract[_batchId];
     }

    /***********************************************************Retailer Section***********************************************/

     mapping(address=>address[]) MedicineBatchRetailer;

     enum salestatus {
        notfound,
        atretailer,
        sold,
        expire,
        damaged
    }

     mapping(address=>salestatus) sale;

     event MedicineStatus(
        address BatchID,
        address indexed Retailer,
        uint status
    );

    function medicineReceivedAtRetailer(address _batchId,address _distributorAddress) public{
        require(roles(Admin(admin).getRole(msg.sender))==roles.retailer,"Ony retailer can access this function");
        Distributor(_distributorAddress).receivePackageRetailer(_batchId, msg.sender);
        MedicineBatchRetailer[msg.sender].push(_batchId);
        sale[_batchId]=salestatus(1);
    } 

    function updateSaleStatus(
        address _batchId,
        uint _status
    ) public {
        require(roles(Admin(admin).getRole(msg.sender))==roles.retailer,"Ony retailer can update status!");
        require(sale[_batchId]==salestatus.atretailer,"Medicine is not at retailer");
        sale[_batchId]=salestatus(_status);
        emit MedicineStatus(_batchId, msg.sender, _status);
    }

    function salesInfo(address _batchId) public view returns(uint){
        return uint(sale[_batchId]);
    }

    function getBatchesCountRetailer(address _retailer) public view returns(uint){
        require(roles(Admin(admin).getRole(_retailer))==roles.retailer,"Ony retailer can call this function!");
        return MedicineBatchRetailer[_retailer].length;
    }

    function getBatchedIdByIndexRetailer(uint index,address _retailer) public view returns(address){
        require(roles(Admin(admin).getRole(_retailer))==roles.retailer,"Ony retailer can call this function!");
        return MedicineBatchRetailer[_retailer][index];
    }

}




