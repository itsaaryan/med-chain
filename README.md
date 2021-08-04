# Med Chain

This project was created using ethereum smart contracts to reduce the supply of drugs illegally.Using blockchain technology I assured that the medicine registered go through a secure channel to the consumer,This projects tracks the cycle of the medicine from raw materials used to the hands of consumer.Every step of the medicine cycle the staus of the medicine is tracked.

### Use cases

1. It can be used to track the vaccines for covid-19.
2. It can be used to track the international medicine tranfer.
3. It can be used to keep track of how a medicine is performing in the market.

---

## Features

- Create a raw material and track its progress.
- View the previously created raw materials.
- Create a medicine using the created raw materials.
- Keep track of the medicine being exported.
- Distribute the medicine to the retailers.
- Update the status of the medicine (sold,expired,damaged,not received etc.)
- keep track of the medicine cycle every step of the way.

---

## Roles

1. Admin

   - Registers a new user (Supplier,Transporter,MAnufacturer,Distributor,Retailer).
   - Reassign roles to existing users.
   - Revoke roles of existing users.
   - keep track of the users.

2. Supplier

   - Creates a new raw material.
   - Keeps track of previously created raw materials.

3. Manufacturer

   - Uses the received raw material to create new medicne.
   - Registers the mew medicine.
   - Exports the new medicine to the distributor.
   - Keeps track of the existing medicines.

4. Distributor

   - Receive the medicine from the manufacturer.
   - Distributes the medicine to the retailers.
   - Keeps track of the distributed medicine.

5. Retailer

   - Receives medicine from the distributor.
   - Sells the medicine.
   - Updates status of the medicine.
   - Keeps track of the sold medicine.

6. Transporter
   - Transports the medicine from supplier to manufacturer.
   - Transports the medicine from the manufacturer to distributor.
   - Transports the medicine from distributor to retailer.

### ADMIN

![All users](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_141_rmobof.png)

---

![Create User](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737421/Screenshot_142_vifybh.png)

### Supplier

![Create Raw Package](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_143_fhza0n.png)

---

![All raw PAckages](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_145_o5zspo.png)

### Transporter

![Pickup](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_146_xcwzcy.png)

### Manufacturer

![Receive raw packages](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_147_xanjrg.png)

---

![Create Medicine](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_148_u07976.png)

---

![All medicine](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737423/Screenshot_149_rnnedw.png)

### Distributor

![Receive Medicine](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737422/Screenshot_150_gc1gda.png)

---

![Transfer to retailer](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737423/Screenshot_151_hli7in.png)

### Retailer

![Receive Medicne](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737423/Screenshot_153_ugehiv.png)

---

![Update status](https://res.cloudinary.com/dsxeglxhm/image/upload/v1624737423/Screenshot_152_i14meo.png)
