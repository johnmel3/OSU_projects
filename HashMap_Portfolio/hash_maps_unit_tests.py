# Name: Melissa J Johnson
# OSU Email: johnmel3@oregonstate.edu
# Course: CS261 - Data Structures
# Assignment: HashMap Portfolio Assignment - Tests
# Due Date: 03/11/2022
# Description: Unit Tests for Hash Map Assignment

import unittest
from hash_map_sc import HashMap
from hash_map_sc import hash_function_1, hash_function_2
from hash_map_oa import HashEntry, HashMap
from a6_include import *

class HashMapSepChainingTests(unittest.TestCase):
    def test_init(self):
        m = HashMap(10, hash_function_1)
        self.assertEqual(0, m.size)
        self.assertEqual(10, m.capacity)

    def test_key_index(self):
        m = HashMap(10, hash_function_1)
        key_index = m.get_key_index('key1')
        self.assertEqual(8, key_index)

    def test_put_item_into_map(self):
        m = HashMap(10, hash_function_1)
        self.assertEqual(0, m.size)
        m.put('key1', 88)
        self.assertEqual(1, m.size)
        self.assertEqual(10, m.capacity)
        key_index = m.get_key_index('key1')
        key_node = m.buckets.get_at_index(key_index).contains('key1')
        self.assertEqual(88, key_node.value)
        m.put('key2', 20)
        key_2_index = m.get_key_index('key2')
        self.assertEqual(20, m.buckets.get_at_index(key_2_index).contains('key2').value)
        m.put('key3', 377)
        key3_index = m.get_key_index('key3')
        self.assertEqual(377, m.buckets.get_at_index(key3_index).contains('key3').value)

    def test_empty_buckets(self):
        m = HashMap(10, hash_function_1)
        self.assertEqual(0, m.size)
        self.assertEqual(10, m.empty_buckets())
        m.put('key1', 88)
        self.assertEqual(1, m.size)
        self.assertEqual(9, m.empty_buckets())
        m.put('key2', 20)
        m.put('key3', 377)
        self.assertEqual(7, m.empty_buckets())
        m.put('key4', 20)
        m.put('key5', 377)
        m.put('key6', 20)
        m.put('key7', 377)
        self.assertEqual(3, m.empty_buckets())

class HashMapOpenAddressing(unittest.TestCase):
    def test_hash_entry_init(self):
        he = HashEntry('mj', 10)
        hm = HashMap(10, hash_function_1)










