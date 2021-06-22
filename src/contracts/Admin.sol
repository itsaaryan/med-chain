pragma solidity >=0.5.0 <0.8.6;

contract Admin{
     address public owner;

    constructor() public{
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender==owner,"sorry!,Ony owner is allowed to visit!");
        _;
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

    event UserRegister(address indexed EthAddress, string Name);
    event UserRoleRevoked(address indexed EthAddress, string Name, uint Role);
    event UserRoleRessign(address indexed EthAddress, string Name, uint Role);

     struct UserInfo{
        string name;
        string location;
        address ethAddress;
        roles role;
    }

      mapping(address => UserInfo) public UsersDetails;
      address[] users;

    function registerUser(address EthAddress,string memory Name,string memory Location,uint Role) public onlyOwner{
        require(UsersDetails[EthAddress].role==roles.norole,"User Already registered");
        UsersDetails[EthAddress].name = Name;
        UsersDetails[EthAddress].location = Location;
        UsersDetails[EthAddress].ethAddress = EthAddress;
        UsersDetails[EthAddress].role = roles(Role);
        users.push(EthAddress);
        emit UserRegister(EthAddress, Name);
    }

    function revokeRole(address userAddress) public onlyOwner {
        require(UsersDetails[userAddress].role!=roles.norole,"user not registered");
        emit UserRoleRevoked(userAddress, UsersDetails[userAddress].name, uint(UsersDetails[userAddress].role));
        UsersDetails[userAddress].role=roles(6);
    }

    function reassignRole(address userAddress,uint Role) public onlyOwner {
          require(UsersDetails[userAddress].role != roles.norole, "User not registered");
        UsersDetails[userAddress].role = roles(Role);
        emit UserRoleRessign(userAddress, UsersDetails[userAddress].name,uint(UsersDetails[userAddress].role));
    }

    /***********************************************User Section****************************************************/

   function getUserInfo(address userAddress) public view returns(string memory,string memory,address,uint){
       return (
           UsersDetails[userAddress].name,
           UsersDetails[userAddress].location,
           UsersDetails[userAddress].ethAddress,
           uint(UsersDetails[userAddress].role)
       );
   }

   function getUsersCount() public view returns(uint count){
       return users.length;
   }

   function getUserByIndex(uint index) public view returns(string memory,string memory,address,uint){
       return getUserInfo(users[index]);
   }

   function getRole(address _address) public view returns(uint){
       return uint(UsersDetails[_address].role);
   }

}