// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ViolenceReport is Ownable {
    struct Report {
        string reportHash;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => Report) private reports;
    string[] private reportHashes;

    event ReportSubmitted(string reportHash, uint256 timestamp);
    event ReportVerified(string reportHash, bool verified, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function submitReport(string memory _reportHash) public onlyOwner {
        require(!reports[_reportHash].exists, "Report already exists");
        
        reports[_reportHash] = Report({
            reportHash: _reportHash,
            timestamp: block.timestamp,
            exists: true
        });
        reportHashes.push(_reportHash);
        
        emit ReportSubmitted(_reportHash, block.timestamp);
    }

    function verifyReport(string memory _reportHash) public view returns (bool) {
        return reports[_reportHash].exists;
    }

    function getAllReports() public view returns (Report[] memory) {
        Report[] memory allReports = new Report[](reportHashes.length);
        
        for(uint i = 0; i < reportHashes.length; i++) {
            allReports[i] = reports[reportHashes[i]];
        }
        
        return allReports;
    }
} 