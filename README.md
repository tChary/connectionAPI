# Node to Oracle Autonomous Transaction Processing.

### History

This project originally started as a quick-and-dirty API for connecting Oracle Integration Cloud to a Autonomous Transaction Processing database instance for a demo use case involving adding franchise locations to a database.

### Today

This project now exists as a tutorial on how to create a Node application that can connect to an Oracle Autonomous Transaction Processing instance. Whether you need to create a quick REST endpoint for your ATP database or have existing microservices running in Node and want to use ATP for your database.

### Acknowledgments

Credit to [tejuscs](https://github.com/tejuscs) for his [very thorough lab on Autonomous Transaction Processing](https://oracle.github.io/learning-library/workshops/autonomous-transaction-processing/?page=README.md). If you want more information on ATP beyond connecting to a Node app, I highly recommend it.

### Prerequisites

This tutorial assumes you have the following:

- An Oracle Autonomous Transaction Processing Database
- The client credentials (wallet, username, and password) for the ATP database
- A VM running Linux, with the ability to update its security access list to open ports. (I've verified these steps on Oracle Cloud Infrastructure (OCI) instance running Oracle Linux 7.6. If you're using a different distro, the specific installation instructions in step 1 will very likely be different. Consult your distro's docs for information on how to complete those installation steps.)

# The Instructions

Okay, we're finally ready to get started. 

1. **Installation - The basics.**

This step covers the software you will need to install on your system that can be installed via a package manager.

* SSH into your Virtual Machine

* Install Node.

`$ sudo yum install nodejs`

* Install Python 2.7 on your system, if needed.

Python 2.7 is very likely to already be on the machine. Check to make sure you have the right version by entering this command.

`$ python --version`

If you get a message that the python command is not found, or if the version you are seeing is not 2.7.5 or higher, enter this command to install it.

`$ sudo yum install -y oracle-epel-release-el7 oracle-release-el7`

* Install git

`$ sudo yum install git`

* Finally, install libaio.

`$ sudo yum install libaio`

2. **Installation - The Instant Client.**

The Oracle Instant Client software is a collection of tools, libraries, and SDKs that allow you to connect to Oracle Database instances, including Oracle Autonomous Transaction Processing.

* Download the Instance Client base collection zip file to your local machine from the [Oracle Technology Network](https://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html). At the time of this writing, you can choose between version 18.5.0.0.0 (instantclient-basic-linux.x64-18.5.0.0.0dbru.zip) and version 12.2.0.1.0 (instantclient-basic-linux.x64-12.2.0.1.0.zip).

* Once you have downloaded the zip file, copy it to the VM using `scp` or `sftp`

* Create a directory on your VM to hold the instant client files.

If you downloaded **instantclient-basic-linux.x64-18.5.0.0.0dbru.zip**, create this directory:

`mkdir  /opt/oracle/instantclient_18_5`

If you downloaded **instantclient-basic-linux.x64-12.2.0.1.0.zip**, create this directory:

`mkdir  /opt/oracle/instantclient_12_2`

* Unzip the client zip file in the directory you created.

* If (and only if) you downloaded **instantclient-basic-linux.x64-12.2.0.1.0.zip**, create the appropriate links for the version of Instant Client:

```
$ cd /opt/oracle/instantclient_12_2
$ ln -s libclntsh.so.12.1 libclntsh.so
$ ln -s libocci.so.12.1 libocci.so
```

2. **Fork and clone this repo.**

I recommend forking this repo before cloning it, so you'll be able to push your commits. Since the existing code here is mostly a shell/framework you'll be doing a lot of changes to its code to make it suit your purpose.

* Once you've forked the repo, clone it on your VM. (Preferably in your home directory.)

```
$ cd ~
$ git clone https://github.com/(Your_User_Name)/connectionAPI
```

3. **Get the secure client credentials, upload them to your VM, and update them as necessary.**

* Go to [cloud.oracle.com](https://cloud.oracle.com) and sign in with your tenancy name, username, and password.

* Click the Menu icon in the upper-left and select Autonomous Transaction Processing.

* You should now see your ATP instance in the list of databases. If you do not see it, make sure that you have selected the compartment where it was created.

* Click the database name

* On the database's information page, click the DB Connection link. This will open a pop-up.

* The pop-up will have a section labeled *Download Client Credentials (Wallet)* and a section labeled *Connection Strings*.

* Save the first TNS name listed under *Connection Strings*. You will need it for step 4!

* Click the *Download* button in the *Download Client Credentials (Wallet)* section.

* Create a password for the wallet. Remember this password, as we'll need it in step 4!

* Click the blue *Download* button and note where the wallet zip file is saved on your computer.

* Using `scp` or `sftp`, copy the wallet zip file from your local computer to the VM.

* SSH into your VM

* Create a directory from your hoe directory to hold the wallet files. In this case, we will make the directory `wallet/`

```
$ cd ~
$ mkdir wallet
```

* Unzip the wallet's zip file to the directory you created.

`$ unzip (wallet_file_name).zip  ~/wallet`

* There is a file in the wallet directory called `sqlnet.ora`. You will need to edit this file so that it points to the correct directory for the wallet files. Edit the file so that it reads exactly as such:

```
WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY=$TNS_ADMIN)))
SSL_SERVER_DN_MATCH=yes
```

* Once you have finished updating `sqlnet.ora`, go to the directory that holds your wallet files. Then, use the command `pwd` to get the full path for that directory. Save this, as we'll need it for step 4!

4. **Set your environmental variables.**

Environmental variables are dynamic values that we can use to pass values into our program without those values being part of the code. This help keeps things like passwords and account names secure.

* Export the LD_LIBRARY_PATH variable first. This will be the path to the Instant Client files.

If you downloaded the 18.5 client, the command will be:

`$ export LD_LIBRARY_PATH=/opt/oracle/instantclient_18_5:$LD_LIBRARY_PATH`

If you downloaded the 12.2 client, the command will be:

`$ export LD_LIBRARY_PATH=/opt/oracle/instantclient_12_2:$LD_LIBRARY_PATH`

* Export the TNS_ADMIN variable next. This will be the full path to your wallet files, that you saved from the last step. Use the command below, but replace `(the_wallet_path)` with the actual path.

`$ export TNS_ADMIN=(the_wallet_path)`

* Export the database username. This will typically be "admin", but may vary depending on how you created the instance. Enter the command below, replacing `(username)` with the actual username.

`$ export DB_USER=(username)`

* Export the wallet password that you set in step 3. Enter the command below, replacing `(password)` with the actual password.

`$ export DB_PW=(password)`

* Finally, export the DB connect string. This string is used by your wallet to find the exact connection information. You can see a list of all the possible connect strings in the file `tnsnames.ora` that is in your wallet directory. Enter the command below, but replace `(connect_string)` with the TNS Name that you saved from step 3. *(Important: Enter the TNS Name in all lower-case.)*

`$ export DB_STRING=(connect_string)`

5. **Install the Node packages.**

* Go to the directory on your virtual machine where you cloned this repo.

* Once in that directory, use this command to install all the necessary Node packages.

`$ npm install`

### Resources

Oracle Instant Client installation instructions.
https://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html#ic_x64_inst

