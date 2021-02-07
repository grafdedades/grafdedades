// ############################################################################
// ############################# GRAF DE DADES ################################
// ############################################################################
// ################# CSV TO JSON (enquesta.csv to data.json) ##################
// ############################################################################

/*
  ________________________
 /\                       \
 \_|      ALUMNES DEL     |
   |      FUKIN GCED      |
   |   ___________________|_
    \_/_____________________/
*/

// ----------------INCLUDES AND GLOBAL VARIABLES DECLARATION-------------------

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <map>
#include <cstdlib>

using namespace std;

const int current_year = 2020;

// ----------------------------------------------------------------------------


// -------------------------------LINK STRUCT----------------------------------

struct Link {
  string s, t; // source and target
  int w; // width
};

// ----------------------------------------------------------------------------

// -------------------------------PERSON CLASS---------------------------------

class Person{

public:
  // Constructor
  Person(int pid, string pname, string pyear, string pgender);

  // Gets the id
  int get_id() const;

  // Gets the x coordinate
  int get_x() const;

  // Gets the y coordinate
  int get_y() const;

  // Gets the name
  string get_name() const;

  // Gets the nick
  string get_nick() const;

  // Gets the colour of his node
  string get_colour() const;

  // Gets the class where he belongs
  int get_year() const;

  // Gets the gender
  char get_gender() const;

  // Gets the map of his links
  map<string, int> get_links() const;

  // Sets the nick
  void add_nick(string nnick);

  // Adds a link to his links' map
  void add_link(string link_name, string link_width, map<string, int>& names,
                vector<Link>& failed_links);

private:
  string name, nick; // Name and nick of the person
  string colour; // Person's node colour in #rgb code
  char gender; // Gender of the person ('M' for male and 'F' for female)
  int id, year; // id and class year of the person
  int x, y; // Coordinates of the person's node
  map<string, int> links; // People linked with the person (string is "n" +
                          // other people's id and int is edge's width)
};

using People = vector<Person>;

// Returns node's colour if the person is a female depending of the year.
// If the person has joined the college (year) far away, he will have an
// less intense blue.
string female(int year){
  string colour = "#";
  int y_diff = current_year - year;
  colour += to_string((y_diff > 9 ? 9 : y_diff))
          + to_string((y_diff > 9 ? 9 : y_diff)) + "F";
  return colour;
}

// Returns node's colour if the person is a male depending of the year.
// If the person has joined the college (year) far away, he will have an
// less intense red.
string male(int year){
  string colour = "#F";
  int y_diff = current_year - year;
  colour += to_string((y_diff > 9 ? 9 : y_diff))
          + to_string((y_diff > 9 ? 9 : y_diff));
  return colour;
}

Person::Person(int pid, string pname, string pyear, string pgender) {
  id = pid; name = pname; year = stoi(pyear); nick = "null";

  if (pgender == "Femení"){
    gender = 'F';
    colour = female(year);
  } else {
    gender = 'M';
    colour = male(year);
  }
  x = rand() / RAND_MAX * 200;
  y = rand() / RAND_MAX * 200;
}

int Person::get_id() const {
  return id;
}

int Person::get_x() const {
  return x;
}

int Person::get_y() const {
  return y;
}

string Person::get_name() const {
  return name;
}

string Person::get_nick() const {
  return nick;
}

string Person::get_colour() const {
  return colour;
}

int Person::get_year() const {
  return year;
}

char Person::get_gender() const {
  return gender;
}

map<string, int> Person::get_links() const {
  return links;
}

void Person::add_nick(string nnick) {
  nick = nnick;
}

// Returns the width of the edge depending on the value of s.
int width(string s){
  if (s == "Mans"){
    return 2;
  } else if (s == "Oral"){
    return 3;
  } else if (s == "Full-equip"){
    return 5;
  }
  return 1;
}

void Person::add_link(string link_name, string link_width, map<string,
                      int>& names, vector<Link>& failed_links) {
  if (names.count(link_name)){
    link_name = "n" + to_string(names[link_name]);
    links[link_name] = width(link_width);
  } else {
    Link failed_link;
    failed_link.s = "n" + to_string(id);
    failed_link.t = link_name;
    failed_link.w = width(link_width);
  }
}

// ----------------------------------------------------------------------------

// Returns the next value from a given istringstream iss without unnecessary
// characters.
string getnextval(istringstream& iss){
  string val;
  char discard_char;

  iss >> discard_char;          // Discard the upper comma before the value.
  getline(iss, val, '"');
  iss >> discard_char;          // Discard the comma after the value.

  return val;
}

// Reads and adds the links of a Person person or saves them at failed_links.
void readLinks(istringstream& iss, Person& person, map<string, int>& names,
                vector<Link>& failed_links){
  string name, width;

  for (int i = 0; i < 15; ++i){ // CSV's Number of link columns.
    name = getnextval(iss);
    width = getnextval(iss);
    if (name != "") person.add_link(name, width, names, failed_links);
  }
}

// Reads a Person represented in iss.
Person readPerson(istringstream& iss, int id, map<string, int>& names,
                  vector<Link>& failed_links){
  string name, nick, year, gender, discard;

  discard = getnextval(iss); // Discard the first column, non relevant.
  name = getnextval(iss);
  nick = getnextval(iss);
  year = getnextval(iss);
  gender = getnextval(iss);
  discard = getnextval(iss); // Discard the sixth column, non relevant.

  names[name] = id;

  Person person (id, name, year, gender);
  if (nick != "") person.add_nick(nick);
  readLinks(iss, person, names, failed_links);
  return person;
}

// Reads the enquesta.csv file and saves its information in people, names and
// failed links.
void ReadCSV(People& people, map<string, int>& names,
             vector<Link>& failed_links){
  ifstream f("enquesta.csv");
  string line, discard, date, name;

  getline(f, discard); // Discard the first row (headers)

  while (getline(f, line)) {
    istringstream iss(line);

    Person person = readPerson(iss, people.size(), names, failed_links);
    people.push_back(person);
  }
  f.close();
}

// The links read with a the target person unread are saved in failed_links and
// this function retry to find its targets and returns the relinked links.
// The refailed links are printed to the console to treat it manualy.
vector<Link> RetryToLink(map<string, int>& names,
                         const vector<Link>& failed_links){
  vector<Link> relinked;
  for (Link link : failed_links){
    if (names.count(link.t)){
      relinked.push_back({link.s, ("n" + to_string(names[link.t])), link.w});
    } else {
      cout << link.s << " with " << link.t << " (" << link.w << ")" << endl;
    }
  }
  return relinked;
}

// Writes to f all people's node information.
void writeNodes(const People& people, ofstream& f){
  f << "{\"nodes\":[";
  for (int i = 0; i < people.size(); ++i){
    f << "{";
    f << "\"id\":" << "\"n" + to_string(people[i].get_id()) + "\"" << ',';
    f << "\"label\":" << "\"" + people[i].get_name() + "\"" << ',';
    f << "\"x\":" << people[i].get_x() << ',';
    f << "\"y\":" << people[i].get_y() /* << ','*/;

    // f << "\"color\":" << "\"" << people[i].get_colour() << "\"";
    f << (i + 1 == people.size() ? "}]" : "},");
  }
}

// Writes to f all people's saved links information.
void writeSavedEdges(const People& people, ofstream& f, int& counter){
  map<string, int> p_links;

  for (Person person : people){
    p_links = person.get_links();
    for (auto link : p_links){
      f << (counter == 0 ? "{" : ",{");
      f << "\"id\":" << "\"e"+to_string(counter)+"\"" << ',';
      f << "\"source\":" << "\"n" << person.get_id() << "\"" << ',';
      f << "\"target\":" << "\""+link.first+"\"" /* << ',' */;
      // f << "\"width\":" << link.second << ',';
      // f << "\"edgeColor\":\"#000\"";
      f << "}";
      ++counter;
    }
  }
}

// Writes to f all the information of the relinked links saved on failed_links.
void writeFailedLinks(const vector<Link>& failed_links, ofstream& f,
                      int& counter){
  for (Link link : failed_links){
    f << (counter == 0 ? "{" : ",{");
    f << "\"id\":" << "\"e"+to_string(counter)+"\"" << ',';
    f << "\"source\":" << "\"n" << link.s << "\"" << ',';
    f << "\"target\":" << "\"n" << link.t << "\"" /* << ',' */;
    // f << "\"width\":" << link.w << ',';
    // f << "\"edgeColor\":\"#000\"";
    f << "}";
    ++counter;
  }
}

// Writes to f all the edges information.
void writeEdges(const People& people, const vector<Link>& failed_links,
                ofstream& f){
  int counter = 0;

  f << ",\"edges\":[";
  writeSavedEdges(people, f, counter);
  writeFailedLinks(failed_links, f, counter);
  f << "]}";
}

// Generate or overwrites data.json with the information from People and
// failed_links vectors with de properly format.
void GenerateJSON(const People& people, const vector<Link>& failed_links){
  ofstream f("data.json");

  writeNodes(people, f);

  writeEdges(people, failed_links, f);

  f.close();
}

int main(){

  // minEdgeSize	1
  // maxEdgeSize	5

  People people;
  map<string, int> names; // Every name with its id
  vector<Link> failed_links;

  ReadCSV(people, names, failed_links);
  failed_links = RetryToLink(names, failed_links);
  GenerateJSON(people, failed_links);
}
