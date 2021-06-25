import React, { Component } from "react";
import { toast } from "react-toastify";
import MedCycle from "../../abis/MedCycle.json";
import Medicine from "../../abis/Medicine.json";
import RawMaterial from "../../abis/RawMaterial.json";
import MedicineInfo from "../../components/MedicineInfo";

export default class MedicinePage extends Component {
  state = {
    allManuMedicineInfo: [],
  };

  componentDidMount = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const MedCycleData = await MedCycle.networks[networkId];
    if (MedCycleData) {
      const medCycle = await new web3.eth.Contract(
        MedCycle.abi,
        MedCycleData.address
      );
      const packageCount = await medCycle.methods
        .getManufacturedMedicineCountManufacturer(accounts[0])
        .call();
      const allManuMedicine = await Promise.all(
        Array(parseInt(packageCount))
          .fill()
          .map((ele, index) =>
            medCycle.methods
              .getManufacturedMedicineIdByIndexManufacturer(index, accounts[0])
              .call()
          )
      );
      await allManuMedicine.forEach(async (medicineAddress) => {
        const medicine = await new window.web3.eth.Contract(
          Medicine.abi,
          medicineAddress
        );
        const info = await medicine.methods.getMediceInfo().call();

        const medicineStatus = await medicine.methods
          .getMedicineStatus()
          .call();

        const rawMaterial = await new window.web3.eth.Contract(
          RawMaterial.abi,
          info[2]
        );
        const rawinfo = await rawMaterial.methods
          .getSuppliedRawMatrials()
          .call();

        const newinfo = {
          ownerAddress: info[0],
          description: info[1],
          rawmaterialAddress: info[2],
          quantity: info[3],
          transporter: info[4],
          distributor: info[5],
          medicineAddress: medicineAddress,
          rawmaterialOwnerName: rawinfo[1],
          rawmaterialDescription: rawinfo[0],
          rawmaterialLocation: rawinfo[2],
          rawmaterialQuantity: rawinfo[3],
          rawmaterialTransporter: rawinfo[4],
          rawmaterialManufacturer: rawinfo[5],
          rawmaterialSupplier: rawinfo[6],
          medicineStatus: medicineStatus,
        };
        this.setState({
          allManuMedicineInfo: [...this.state.allManuMedicineInfo, newinfo],
        });
      });
    } else {
      toast.error("The MEDCycle Contract does not exist on this network!");
    }
  };

  renderMedicineInfo = () => {
    return this.state.allManuMedicineInfo?.map((medicineInfo) => {
      return <MedicineInfo medicineInfo={medicineInfo} />;
    });
  };

  render() {
    console.log(this.state.allManuMedicineInfo);
    return <div>{this.renderMedicineInfo()}</div>;
  }
}
