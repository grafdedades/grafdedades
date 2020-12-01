#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <map>
#include <cstdlib>

using namespace std;

const int current_year = 2020;

struct Link {
  string s, t; // source and target
  int w; // width
};

// --------------PERSON CLASS-----------

class Person{

public:
  Person(int pid, string pname, string pyear, string pgender);

  int get_id() const;

  int get_x() const;

  int get_y() const;

  string get_name() const;

  string get_nick() const;

  string get_colour() const;

  int get_year() const;

  char get_gender() const;

  map<string, int> get_links() const;

  void add_nick(string nnick);

  void add_link(string link_name, string link_width, map<string, int>& names, vector<Link>& failed_links);

private:
  string name, nick, colour;
  char gender;
  int id, x, y, year;
  map<string, int> links;
};

string female(int year){
  string colour = "#";
  int y_diff = current_year - year;
  colour += to_string((y_diff > 9 ? 9 : y_diff)) + to_string((y_diff > 9 ? 9 : y_diff)) + "F";
  return colour;
}

string male(int year){
  string colour = "#F";
  int y_diff = current_year - year;
  colour += to_string((y_diff > 9 ? 9 : y_diff)) + to_string((y_diff > 9 ? 9 : y_diff));
  return colour;
}

Person::Person(int pid, string pname, string pyear, string pgender) {
  id = pid; name = pname; year = stoi(pyear);
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

void Person::add_link(string link_name, string link_width, map<string, int>& names, vector<Link>& failed_links) {
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

// -------------------------------------

using People = vector<Person>;

string getnextval(istringstream& iss){
  string val;
  char discard_char;

  iss >> discard_char;          // Discard the upper comma before the value.
  getline(iss, val, '"');
  iss >> discard_char;          // Discard the comma after the value.

  return val;
}

void readLinks(istringstream& iss, Person& person, map<string, int>& names, vector<Link>& failed_links){
  string name, width;

  for (int i = 0; i < 15; ++i){
    name = getnextval(iss);
    width = getnextval(iss);
    if (name != "") person.add_link(name, width, names, failed_links);
  }
}


Person readPerson(istringstream& iss, int id, map<string, int>& names, vector<Link>& failed_links){
  string name, nick, year, gender, discard;

  discard = getnextval(iss); // Discard the first column, its information is not important.
  name = getnextval(iss);
  nick = getnextval(iss);
  year = getnextval(iss);
  gender = getnextval(iss);
  discard = getnextval(iss); // Discard the sixth column, its information is not important.

  names[name] = id;

  Person person (id, name, year, gender);
  if (nick != "") person.add_nick(nick);
  readLinks(iss, person, names, failed_links);
  return person;
}

void ReadCSV(People& people, map<string, int>& names, vector<Link>& failed_links){
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

vector<Link> RetryToLink(map<string, int>& names, const vector<Link>& failed_links){
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

void GenerateJSON(const People& people, const vector<Link>& failed_links){
  ofstream f("data.json");
  f << "{\"nodes\":[";
  for (int i = 0; i < people.size(); ++i){
    f << "{";
    f << "\"id\":" << "\"n" + to_string(people[i].get_id()) + "\"" << ',';
    f << "\"label\":" << "\"" + people[i].get_name() + "\"" << ',';
    f << "\"x\":" << people[i].get_x() << ',';
    f << "\"y\":" << people[i].get_y() /* << ','*/;

    // f << "\"color\":" << "\"" << people[i].get_colour() << "\"";
    f << (i + 1 == people.size() ? "}" : "},");
  }

  f << ",\"edges\":[";
  map<string, int> person = people[0].get_links();
  int counter = 0;
  for (auto link : person){
    f << (counter == 0 ? "{" : ",{");
    f << "\"id\":" << "\"e" + to_string(counter) + "\"" << ',';
    f << "\"source\":" << "\"n" << people[0].get_id() << "\"" << ',';
    f << "\"target\":" << "\"" + link.first + "\"" /* << ',' */;
    // f << "\"width\":" << link.second << ',';
    // f << "\"edgeColor\":\"#000\"";
    f << "}";
    ++counter;
  }

  for (int i = 1; i < people.size(); ++i){
    person = people[i].get_links();
    for (auto link : person){
      f << (counter == 0 ? "{" : ",{");
      f << "\"id\":" << "\"e"+to_string(counter)+"\"" << ',';
      f << "\"source\":" << "\"n" << people[i].get_id() << "\"" << ',';
      f << "\"target\":" << "\""+link.first+"\"" /* << ',' */;
      // f << "\"width\":" << link.second << ',';
      // f << "\"edgeColor\":\"#000\"";
      f << "}";
      ++counter;
    }
  }

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

  f << "]}";
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
