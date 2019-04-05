# Node to Oracle Autonomous Transaction Processing.

### History

This project originally started as an API for connecting Oracle Integration Cloud to a Autonomous Transaction Processing database instance for a demo use case involving adding franchise locations to a database.

### Today

This project now exists as a tutorial on how to create a Node application that can connect to an Oracle Autonomous Transaction Processing instance. Whether you need to create a quick REST endpoint for your ATP database or have existing microservices running in Node and want to use ATP for your database.

### Acknowledgments

Credit to [tejuscs](https://github.com/tejuscs) for his [very thorough lab on Autonomous Transaction Processing](https://oracle.github.io/learning-library/workshops/autonomous-transaction-processing/?page=README.md). If you want more information on ATP beyond connecting to a Node app, I highly recommend it.

### Prerequisites

This tutorial assumes you have the following:

- An Oracle Autonomous Transaction Processing Database
- The client credentials (wallet) for the ATP database
- A VM running Linux, with the ability to update its security access list to open ports. (I've verified these steps on Oracle Cloud Infrastructure (OCI) instance running Oracle Linux 7.6. If you're using a different distro, consult its docs for the proper steps.)

# The Instructions

Okay, we're finally ready to get started. 

0. SSH into your Virtual Machine.

Everything we're doing here is on the command line of the virtual machine unless otherwise noted.

1. Install **Node.js**, **Python 2.7**, **git**, and **libaio**

Enter this command to install Node.

`$ sudo yum install nodejs`

Python 2.7 is very likely to already be on the machine. Check to make sure you have the right version by entering this command.

`$ python --version`

If the version you are seeing is not 2.7.5 or higher, enter this command to install it.

`sudo yum install -y oracle-epel-release-el7 oracle-release-el7`

Install git

`sudo yum install git`

Finally, install libaio.

`sudo yum install libaio`