// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PropertyRegistry
 * @dev BhoomiShield Decentralized Land Registry and Litigation Prevention Contract
 * Never stores confidential property documents directly on-chain.
 * Stores cryptographically secure SHA-256 document hashes and immutable ownership transfer logs.
 */
contract PropertyRegistry {
    address public authorityAdmin;

    enum VerificationStatus { Pending, Verified, Flagged, Rejected }

    struct PropertyRecord {
        string propertyId;
        string surveyNumber;
        address currentOwnerWallet;
        string currentOwnerName;
        string documentHash; // SHA-256 hash of legal deed / encumbrance certificate
        uint256 registrationTimestamp;
        VerificationStatus status;
        bool isDisputed;
        uint256 transferCount;
    }

    struct OwnershipLog {
        address fromWallet;
        address toWallet;
        string fromName;
        string toName;
        uint256 timestamp;
        string deedHash;
        string remarks;
    }

    // Mapping from Property ID string to Property Record
    mapping(string => PropertyRecord) private properties;
    mapping(string => bool) private propertyExists;
    mapping(string => OwnershipLog[]) private ownershipHistory;

    event PropertyRegistered(
        string indexed propertyId,
        string surveyNumber,
        string ownerName,
        string documentHash,
        uint256 timestamp
    );

    event OwnershipTransferred(
        string indexed propertyId,
        string fromName,
        string toName,
        string deedHash,
        uint256 timestamp
    );

    event PropertyStatusUpdated(
        string indexed propertyId,
        VerificationStatus status,
        string reason
    );

    event PropertyFlagged(
        string indexed propertyId,
        string conflictReason,
        uint256 timestamp
    );

    modifier onlyAuthority() {
        require(msg.sender == authorityAdmin, "Unauthorized: BhoomiShield Authority access required");
        _;
    }

    modifier exists(string memory _propertyId) {
        require(propertyExists[_propertyId], "Property record does not exist on blockchain");
        _;
    }

    constructor() {
        authorityAdmin = msg.sender;
    }

    /**
     * @notice Register a newly minted or surveyed property record
     */
    function registerProperty(
        string memory _propertyId,
        string memory _surveyNumber,
        string memory _ownerName,
        string memory _documentHash
    ) external {
        require(!propertyExists[_propertyId], "Property ID already registered");
        require(bytes(_propertyId).length > 0, "Property ID cannot be empty");
        require(bytes(_documentHash).length > 0, "Document SHA-256 hash required");

        PropertyRecord memory newProp = PropertyRecord({
            propertyId: _propertyId,
            surveyNumber: _surveyNumber,
            currentOwnerWallet: msg.sender,
            currentOwnerName: _ownerName,
            documentHash: _documentHash,
            registrationTimestamp: block.timestamp,
            status: VerificationStatus.Pending,
            isDisputed: false,
            transferCount: 0
        });

        properties[_propertyId] = newProp;
        propertyExists[_propertyId] = true;

        // Initial genesis ownership log
        ownershipHistory[_propertyId].push(OwnershipLog({
            fromWallet: address(0),
            toWallet: msg.sender,
            fromName: "Genesis Survey / Government Registry",
            toName: _ownerName,
            timestamp: block.timestamp,
            deedHash: _documentHash,
            remarks: "Initial Property Genesis Registration"
        }));

        emit PropertyRegistered(_propertyId, _surveyNumber, _ownerName, _documentHash, block.timestamp);
    }

    /**
     * @notice Transfer ownership of a property record with dispute locking
     */
    function transferOwnership(
        string memory _propertyId,
        address _newOwnerWallet,
        string memory _newOwnerName,
        string memory _newDeedHash
    ) external exists(_propertyId) {
        PropertyRecord storage prop = properties[_propertyId];

        require(!prop.isDisputed, "Transaction blocked: Property is currently flagged under legal dispute");
        require(
            msg.sender == prop.currentOwnerWallet || msg.sender == authorityAdmin,
            "Caller is not recorded owner or authorized registrar"
        );
        require(bytes(_newOwnerName).length > 0, "New owner name is required");

        string memory previousOwner = prop.currentOwnerName;
        address previousWallet = prop.currentOwnerWallet;

        prop.currentOwnerWallet = _newOwnerWallet;
        prop.currentOwnerName = _newOwnerName;
        prop.documentHash = _newDeedHash;
        prop.transferCount += 1;

        ownershipHistory[_propertyId].push(OwnershipLog({
            fromWallet: previousWallet,
            toWallet: _newOwnerWallet,
            fromName: previousOwner,
            toName: _newOwnerName,
            timestamp: block.timestamp,
            deedHash: _newDeedHash,
            remarks: "Verified Ownership Conveyance"
        }));

        emit OwnershipTransferred(_propertyId, previousOwner, _newOwnerName, _newDeedHash, block.timestamp);
    }

    /**
     * @notice Retrieve property metadata
     */
    function getProperty(string memory _propertyId)
        external
        view
        exists(_propertyId)
        returns (
            string memory propertyId,
            string memory surveyNumber,
            address currentOwnerWallet,
            string memory currentOwnerName,
            string memory documentHash,
            uint256 registrationTimestamp,
            VerificationStatus status,
            bool isDisputed,
            uint256 transferCount
        )
    {
        PropertyRecord memory p = properties[_propertyId];
        return (
            p.propertyId,
            p.surveyNumber,
            p.currentOwnerWallet,
            p.currentOwnerName,
            p.documentHash,
            p.registrationTimestamp,
            p.status,
            p.isDisputed,
            p.transferCount
        );
    }

    /**
     * @notice Retrieve full chronological ownership audit log
     */
    function getOwnershipHistory(string memory _propertyId)
        external
        view
        exists(_propertyId)
        returns (OwnershipLog[] memory)
    {
        return ownershipHistory[_propertyId];
    }

    /**
     * @notice Get current recorded owner
     */
    function getCurrentOwner(string memory _propertyId)
        external
        view
        exists(_propertyId)
        returns (string memory currentOwnerName, address currentOwnerWallet)
    {
        PropertyRecord memory p = properties[_propertyId];
        return (p.currentOwnerName, p.currentOwnerWallet);
    }

    /**
     * @notice Verify a property after administrative inspection
     */
    function verifyProperty(string memory _propertyId) external onlyAuthority exists(_propertyId) {
        properties[_propertyId].status = VerificationStatus.Verified;
        properties[_propertyId].isDisputed = false;
        emit PropertyStatusUpdated(_propertyId, VerificationStatus.Verified, "Verified by Revenue Authority");
    }

    /**
     * @notice Flag property due to conflicting claim or fraudulent title deed
     */
    function flagProperty(string memory _propertyId, string memory _reason) external exists(_propertyId) {
        properties[_propertyId].status = VerificationStatus.Flagged;
        properties[_propertyId].isDisputed = true;
        emit PropertyFlagged(_propertyId, _reason, block.timestamp);
    }
}
