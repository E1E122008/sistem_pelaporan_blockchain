// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ViolenceReport {
    struct Report {
        string violenceType;
        string location;
        uint256 date;
        string fileHash;
        bool exists;
    }
    
    mapping(string => Report) public reports;
    string[] public allReportHashes;
    
    event ReportSubmitted(string fileHash, string violenceType, string location, uint256 date);
    
    function submitReport(
        string memory _violenceType,
        string memory _location,
        uint256 _date,
        string memory _fileHash
    ) public {
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        require(!reports[_fileHash].exists, "Report with this hash already exists");
        
        reports[_fileHash] = Report({
            violenceType: _violenceType,
            location: _location,
            date: _date,
            fileHash: _fileHash,
            exists: true
        });
        
        allReportHashes.push(_fileHash);
        
        emit ReportSubmitted(_fileHash, _violenceType, _location, _date);
    }
    
    function verifyReport(string memory _fileHash) public view returns (bool) {
        return reports[_fileHash].exists;
    }
    
    function getReport(string memory _fileHash) public view returns (
        string memory violenceType,
        string memory location,
        uint256 date,
        string memory fileHash,
        bool exists
    ) {
        Report memory report = reports[_fileHash];
        return (
            report.violenceType,
            report.location,
            report.date,
            report.fileHash,
            report.exists
        );
    }
    
    function getAllReportHashes() public view returns (string[] memory) {
        return allReportHashes;
    }
    
    function getReportCount() public view returns (uint256) {
        return allReportHashes.length;
    }
} 