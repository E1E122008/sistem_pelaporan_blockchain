// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ViolenceReport {
    struct Report {
        string violenceType;
        string location;
        string relationWithPerpetrator;
        uint256 date;
        string fileName;
        bool exists;
    }
    
    mapping(string => Report) public reports;
    string[] public allReportHashes;
    
    event ReportSubmitted(
        string reportHash,
        string violenceType,
        string location,
        string relationWithPerpetrator,
        uint256 date,
        string fileName
    );
    
    function submitReport(
        string memory _reportHash,
        string memory _violenceType,
        string memory _location,
        string memory _relationWithPerpetrator,
        uint256 _date,
        string memory _fileName
    ) public {
        require(bytes(_reportHash).length > 0, "Report hash cannot be empty");
        require(!reports[_reportHash].exists, "Report with this hash already exists");
        
        reports[_reportHash] = Report({
            violenceType: _violenceType,
            location: _location,
            relationWithPerpetrator: _relationWithPerpetrator,
            date: _date,
            fileName: _fileName,
            exists: true
        });
        
        allReportHashes.push(_reportHash);
        
        emit ReportSubmitted(_reportHash, _violenceType, _location, _relationWithPerpetrator, _date, _fileName);
    }
    
    function verifyReport(string memory _fileHash) public view returns (bool) {
        return reports[_fileHash].exists;
    }
    
    function getReport(string memory _reportHash) public view returns (
        string memory violenceType,
        string memory location,
        string memory relationWithPerpetrator,
        uint256 date,
        string memory fileName,
        bool exists
    ) {
        Report memory report = reports[_reportHash];
        return (
            report.violenceType,
            report.location,
            report.relationWithPerpetrator,
            report.date,
            report.fileName,
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