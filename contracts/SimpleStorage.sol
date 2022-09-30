//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// @title Simple contract created by Llydo1
contract SimpleStorage {
    // Current favorite number
    uint256 public favoriteNumber;

    // Represent a people struc
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // Represent the array of people
    People[] public people;

    // Represent the mapping from People.name to People.favoriteNumber
    mapping(string => uint256) public nameToFavoiteNumber;

    // @dev Cpdate the current favoriteNumber of the contract
    // @param _favoriteNumber - number that will replace the current
    //  favoriteNumber
    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    // @dev Add new People to the people array
    // @param _name - name of People
    // @param _favoriteNumber - favoriteNumber of People
    function addPeople(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoiteNumber[_name] = _favoriteNumber;
    }

    // @dev Returns the current favoriteNumber of the contract
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }
}
