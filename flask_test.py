import unittest
from app import *
import json

class TestApp(unittest.TestCase):

    def setUp(self):
        with app.app_context():
            connect()

    def test_getNode(self):
        with app.app_context():
            result = getNode('Alex')
            self.assertEqual(self.jsonHelper(result, 'name'), 'Alex')

    def test_getTrees(self):
        with app.app_context():
            result = getTrees()
            self.assertEqual(len(self.jsonHelper(result, 'tree_roots')), 1)

    def test_getTree(self):
        with app.app_context():
            result = getTree('Alex')
            self.assertEqual(len(json.loads(result.data)), 1)


    def jsonHelper(self, response, property):
        return json.loads(response.data)[property]

def suite():
    suite = unittest.TestSuite()
    suite.addTests(
        unittest.TestLoader().loadTestsFromTestCase(TestApp)
    )
    return suite

if __name__ == '__main__':
   unittest.TextTestRunner(verbosity=2).run(suite())