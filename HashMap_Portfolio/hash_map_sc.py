# Name: Melissa J Johnson
# OSU Email: johnmel3@oregonstate.edu
# Course: CS261 - Data Structures
# Assignment: HashMap Portfolio Assignment - Separate chaining version
# Due Date: 03/11/2022
# Description: Implement two versions of a HashMap: one using chaining
# and the other using open addressing.

from a6_include import *


def hash_function_1(key: str) -> int:
    """
    Sample Hash function #1 to be used with A5 HashMap implementation
    DO NOT CHANGE THIS FUNCTION IN ANY WAY
    """
    hash = 0
    for letter in key:
        hash += ord(letter)
    return hash


def hash_function_2(key: str) -> int:
    """
    Sample Hash function #2 to be used with A5 HashMap implementation
    DO NOT CHANGE THIS FUNCTION IN ANY WAY
    """
    hash, index = 0, 0
    index = 0
    for letter in key:
        hash += (index + 1) * ord(letter)
        index += 1
    return hash


class HashMap:
    def __init__(self, capacity: int, function) -> None:
        """
        Init new HashMap based on DA with SLL for collision resolution
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        self.buckets = DynamicArray()
        for _ in range(capacity):
            self.buckets.append(LinkedList())
        self.capacity = capacity
        self.hash_function = function
        self.size = 0

    def __str__(self) -> str:
        """
        Overrides object's string method
        Return content of hash map t in human-readable form
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        out = ''
        for i in range(self.buckets.length()):
            list = self.buckets.get_at_index(i)
            out += str(i) + ': ' + str(list) + '\n'
        return out

    def clear(self) -> None:
        """
        This method clears the contents of the hash map. It does not
        change the hash table capacity.
        """
        self.size = 0
        self.buckets = DynamicArray()
        for i in range(self.capacity):
            self.buckets.append(LinkedList())

    # Function written for my unittests so I didn't have to re-write the same lines so many times
    def get_key_index(self, key):
        return self.hash_function(key) % self.capacity

    def get(self, key: str) -> object:
        """
        This method returns the value associated with a given key.
        If the key is not in the hash map, None is returned.
        """
        key_index = self.hash_function(key) % self.capacity
        key_node = self.buckets.get_at_index(key_index).contains(key)

        if key_node is None:
            return None
        else:
            return key_node.value

    def put(self, key: str, value: object) -> None:
        """
        This method updates the key-value pair in the hash map.
        If the key is already present in the hash map, its value is replaced
        with the new value. If the key is not in the hash map, a key/value pair
        is added.
        """
        key_index = self.hash_function(key) % self.capacity
        key_node = self.buckets.get_at_index(key_index).contains(key)
        if key_node is None:
            self.buckets.get_at_index(key_index).insert(key, value)
            self.size += 1
        else:
            key_node.value = value

    def remove(self, key: str) -> None:
        """
        This method removes a key-value pair from the hash map.
        If the key is not in the hash map, nothing is done.
        """
        key_index = self.hash_function(key) % self.capacity
        key_to_remove = self.buckets.get_at_index(key_index).remove(key)
        if key_to_remove:
            self.size -= 1

    def contains_key(self, key: str) -> bool:
        """
        This method returns True if the key is present in the hash map.
        If the key is not present, it returns False.
        """
        key_index = self.hash_function(key) % self.capacity
        key_node = self.buckets.get_at_index(key_index).contains(key)
        if key_node is None:
            return False

        return True

    def empty_buckets(self) -> int:
        """
        This method returns the integer number of empty buckets that
        remain in the hash table.
        """
        empty_buckets = 0

        for i in range(self.capacity):
            if self.buckets.get_at_index(i).length() == 0:
                empty_buckets += 1
        return empty_buckets


    def table_load(self) -> float:
        """
        This method returns the load factor of the current hash table.
        """
        return self.size/self.capacity

    def resize_table(self, new_capacity: int) -> None:
        """
        This method resizes the the capacity of the internal hash table.
        All key-value pairs remain in the new hash map and hash table links
        are rehashed. If the new capacity is less than 1, the method
        does nothing.
        """
        if new_capacity < 1:
            return

        # initialize new table with new capacity
        new_table = HashMap(new_capacity, self.hash_function)
        # Iterate over old/present table to copy to new table
        for i in range(self.capacity):
            ll = self.buckets.get_at_index(i)
            for node in ll:
                new_table.put(node.key, node.value)

        self.__init__(new_table.capacity, new_table.hash_function)
        self.buckets = new_table.buckets
        self.size = new_table.size


    def get_keys(self) -> DynamicArray:
        """
        This method returns a DynamicArray object of all the keys stored
        in the hash map.
        """
        da = DynamicArray()

        for i in range(self.capacity):
            ll = self.buckets.get_at_index(i)
            # Iterate through linkedlist at each index and append key to Dynamic Array object
            for node in ll:
                da.append(node.key)
        return da



# BASIC TESTING
if __name__ == "__main__":

    print("\nPDF - empty_buckets example 1")
    print("-----------------------------")
    m = HashMap(100, hash_function_1)
    print(m.empty_buckets(), m.size, m.capacity)
    m.put('key1', 10)
    print(m.empty_buckets(), m.size, m.capacity)
    m.put('key2', 20)
    print(m.empty_buckets(), m.size, m.capacity)
    m.put('key1', 30)
    print(m.empty_buckets(), m.size, m.capacity)
    m.put('key4', 40)
    print(m.empty_buckets(), m.size, m.capacity)

    print("\nPDF - empty_buckets example 2")
    print("-----------------------------")
    m = HashMap(50, hash_function_1)
    for i in range(150):
        m.put('key' + str(i), i * 100)
        if i % 30 == 0:
            print(m.empty_buckets(), m.size, m.capacity)

    print("\nPDF - table_load example 1")
    print("--------------------------")
    m = HashMap(100, hash_function_1)
    print(m.table_load())
    m.put('key1', 10)
    print(m.table_load())
    m.put('key2', 20)
    print(m.table_load())
    m.put('key1', 30)
    print(m.table_load())

    print("\nPDF - table_load example 2")
    print("--------------------------")
    m = HashMap(50, hash_function_1)
    for i in range(50):
        m.put('key' + str(i), i * 100)
        if i % 10 == 0:
            print(m.table_load(), m.size, m.capacity)

    print("\nPDF - clear example 1")
    print("---------------------")
    m = HashMap(100, hash_function_1)
    print(m.size, m.capacity)
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key1', 30)
    print(m.size, m.capacity)
    m.clear()
    print(m.size, m.capacity)

    print("\nPDF - clear example 2")
    print("---------------------")
    m = HashMap(50, hash_function_1)
    print(m.size, m.capacity)
    m.put('key1', 10)
    print(m.size, m.capacity)
    m.put('key2', 20)
    print(m.size, m.capacity)
    m.resize_table(100)
    print(m.size, m.capacity)
    m.clear()
    print(m.size, m.capacity)

    print("\nPDF - put example 1")
    print("-------------------")
    m = HashMap(50, hash_function_1)
    for i in range(150):
        m.put('str' + str(i), i * 100)
        if i % 25 == 24:
            print(m.empty_buckets(), m.table_load(), m.size, m.capacity)

    print("\nPDF - put example 2")
    print("-------------------")
    m = HashMap(40, hash_function_2)
    for i in range(50):
        m.put('str' + str(i // 3), i * 100)
        if i % 10 == 9:
            print(m.empty_buckets(), m.table_load(), m.size, m.capacity)

    print("\nPDF - contains_key example 1")
    print("----------------------------")
    m = HashMap(10, hash_function_1)
    print(m.contains_key('key1'))
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key3', 30)
    print(m.contains_key('key1'))
    print(m.contains_key('key4'))
    print(m.contains_key('key2'))
    print(m.contains_key('key3'))
    m.remove('key3')
    print(m.contains_key('key3'))

    print("\nPDF - contains_key example 2")
    print("----------------------------")
    m = HashMap(75, hash_function_2)
    keys = [i for i in range(1, 1000, 20)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.size, m.capacity)
    result = True
    for key in keys:
        # all inserted keys must be present
        result &= m.contains_key(str(key))
        # NOT inserted keys must be absent
        result &= not m.contains_key(str(key + 1))
    print(result)

    print("\nPDF - get example 1")
    print("-------------------")
    m = HashMap(30, hash_function_1)
    print(m.get('key'))
    m.put('key1', 10)
    print(m.get('key1'))

    print("\nPDF - get example 2")
    print("-------------------")
    m = HashMap(150, hash_function_2)
    for i in range(200, 300, 7):
        m.put(str(i), i * 10)
    print(m.size, m.capacity)
    for i in range(200, 300, 21):
        print(i, m.get(str(i)), m.get(str(i)) == i * 10)
        print(i + 1, m.get(str(i + 1)), m.get(str(i + 1)) == (i + 1) * 10)

    print("\nPDF - remove example 1")
    print("----------------------")
    m = HashMap(50, hash_function_1)
    print(m.get('key1'))
    m.put('key1', 10)
    print(m.get('key1'))
    m.remove('key1')
    print(m.get('key1'))
    m.remove('key4')

    print("\nPDF - resize example 1")
    print("----------------------")
    m = HashMap(20, hash_function_1)
    m.put('key1', 10)
    print(m.size, m.capacity, m.get('key1'), m.contains_key('key1'))
    m.resize_table(30)
    print(m.size, m.capacity, m.get('key1'), m.contains_key('key1'))

    print("\nPDF - resize example 1.5")
    print("----------------------")
    m = HashMap(10, hash_function_1)
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key3', 30)
    print(m.size, m.capacity, m.get('key1'), m.contains_key('key1'))
    m.resize_table(20)
    print(m.size, m.capacity, m.get('key1'), m.contains_key('key1'))

    print("\nPDF - resize example 2")
    print("----------------------")
    m = HashMap(75, hash_function_2)
    keys = [i for i in range(1, 1000, 13)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.size, m.capacity)

    for capacity in range(111, 1000, 117):
        m.resize_table(capacity)

        m.put('some key', 'some value')
        result = m.contains_key('some key')
        m.remove('some key')

        for key in keys:
            result &= m.contains_key(str(key))
            result &= not m.contains_key(str(key + 1))
        print(capacity, result, m.size, m.capacity, round(m.table_load(), 2))

    print("\nPDF - get_keys example 1")
    print("------------------------")
    m = HashMap(10, hash_function_2)
    for i in range(100, 200, 10):
        m.put(str(i), str(i * 10))
    print(m.get_keys())

    m.resize_table(1)
    print(m.get_keys())

    m.put('200', '2000')
    m.remove('100')
    m.resize_table(2)
    print(m.get_keys())
